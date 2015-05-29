package db

import javax.inject.{Inject, Singleton}

import org.joda.time.DateTime
import play.api.db.slick._

import slick.driver.MySQLDriver.api._
import slick.profile.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import db.Tables._

@Singleton
class SearchesDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
  extends HasDatabaseConfigProvider[RelationalProfile] {
  import extensions.FutureO

  def saveHostelSearch(sessionId: String, hostelName: String, city: String, adwords: Int): Future[Option[Int]] =
    (for {
      hostel    ← FutureO(db.run(hostelQuery(hostelName).result.headOption))
      location  ← FutureO(db.run(locationQuery(city).result.headOption))
      searchId  ← FutureO(db.run(insertSearchQuery(sessionId, adwords, location, Some(hostel))).map(Some(_)))
    } yield searchId).future

  // TODO: Separate into smaller methods
  def saveTagsSearch(sessionId: String, tags: Seq[String], city: String, adwords: Int): Future[Option[Int]] =
    if (tags.isEmpty)
      Future.successful(None)
    else {
      val f = db.run(attributeLocationQuery(tags, city).result)

      // Insert search
      val searchIdFO =
        for {
          attrLocation  ← FutureO(f.map(_.headOption))
          (_, location) = attrLocation
          searchId      ← FutureO(db.run(insertSearchQuery(sessionId, adwords, location, None)).map(Some(_)))
        } yield searchId

      // Insert Attributes
      val attrRowsFO =
        for {
          searchId      ← FutureO(searchIdFO.future)
          attrsLocation ← FutureO(f.map(Some(_)))
          attrRow       = attrsLocation.map(attrLocation => buildAttributeSearchRow(searchId, attrLocation._1))
        } yield attrRow

      attrRowsFO.flatMap(attrRow => FutureO(db.run(insertAttributeSearchesQuery(attrRow)).map(Some(_))))

      searchIdFO.future
    }

  def saveCitySearch(sessionId: String, city: String, adwords: Int): Future[Option[Int]] =
    (for {
      location ← FutureO(db.run(locationQuery(city).result.headOption))
      searchId ← FutureO(db.run(insertSearchQuery(sessionId, adwords, location, None)).map(Some(_)))
    } yield searchId).future

  private def attributeLocationQuery(tags: Seq[String], city: String) =
    for {
      l ← Location  if l.city === city
      a ← Attribute if a.name inSetBind tags
    } yield (a, l)

  private def hostelQuery(name: String) =
    Hostel.filter(_.name === name)

  private def locationQuery(city: String) =
    Location.filter(_.city === city)

  private def insertSearchQuery(sessionId: String, adwords: Int, location: LocationRow, hostelOpt: Option[HostelRow]) = {
    Search.map(s => (s.sess, s.cityId, s.hostelId, s.timestamp, s.adwords)) returning Search.map(_.id) +=
      (sessionId, location.id, hostelOpt.map(_.id), DateTime.now.getMillis, adwords == 1)
  }

  private def insertAttributeSearchesQuery(attributeSearches: Seq[AttributeSearchRow]) =
    AttributeSearch ++= attributeSearches

  private def buildAttributeSearchRow(searchId: Int, attribute: AttributeRow) =
    AttributeSearchRow(attribute.id, searchId)

}
