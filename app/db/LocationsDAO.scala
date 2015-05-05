package db

import com.google.inject.{ Inject, Singleton }
import models.TagHolder

import play.api.db.slick._

import slick.driver.MySQLDriver.api._
import slick.profile.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import db.Tables._

@Singleton
class LocationsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[RelationalProfile] {
  import extensions.FutureO

  type LocationResult = (Int, String, String, String)

  def loadLocation(city: String, stop: Set[String]): Future[Option[models.Location]] =
    (for {
      location ← FutureO(db.run(locationQuery(city)).map(buildLocationOpt))
      services ← FutureO(db.run(servicesQuery(location.id).take(10).to[Set].result.map(Some(_))))
    } yield createLocationWithServices(services, location)).future

  def getLocationHints(query: String): Future[Seq[String]] =
    db.run(hintsQuery(s"$query%").take(10).result)
      .map(createCityCountryStrings)

  def locationQuery(city: String): DBIO[Seq[(Int, String, String, String)]] = {
    val LocationsLimit = 10

    sql"""
       SELECT   l.id, l.city, l.country, a.name
       FROM     hostel h, attribute a, hostel_attribute ha, location l
       WHERE    l.city = $city and h.id = ha.hostel_id and a.id = ha.attribute_id and h.location_id = l.id
       GROUP BY a.name
       ORDER BY rating DESC LIMIT $LocationsLimit
    """.as[LocationResult]
  }

  def servicesQuery(locationId: Int) =
    for {
      l  ← Location      if l.id === locationId
      h  ← Hostel        if l.id === h.locationId
      hs ← HostelService if h.id === hs.hostelId
      s  ← Service       if s.id === hs.serviceId
    } yield s.name

  private def hintsQuery(query: String) =
    for {
      l ← Location if (l.city like query) || (l.country like query)
    } yield (l.city, l.country)

  private def buildLocationOpt(locationResults: Seq[LocationResult]): Option[models.Location] = {
    import models.Location

    @scala.annotation.tailrec
    def helper(results: Seq[LocationResult], locationOpt: Option[Location]): Option[Location] =
      if (locationOpt.nonEmpty || results.isEmpty) locationOpt
      else {
        val (lid, city, country, tag) = results.head
        val location =
          locationOpt.fold {
            Location(lid, city, country, Seq(tag), Set())
          } { location =>
            if (TagHolder.ClicheTags contains tag)
              location
            else
              location.copy(commonTags = tag +: location.commonTags)
          }
        helper(results.tail, Some(location))
      }

    helper(locationResults, None)
  }

  private def createLocationWithServices(services: Set[String], location: models.Location): models.Location =
    location.copy(commonServices = services)

  private def createCityCountryStrings(citiesWithCountry: Seq[(String, String)]) =
    citiesWithCountry.map(tuple => s"${tuple._1}, ${tuple._2}")

}