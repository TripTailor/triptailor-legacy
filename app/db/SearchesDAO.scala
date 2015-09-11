package db

import javax.inject.{Inject, Singleton}

import org.joda.time.DateTime
import play.api.db.slick._

import slick.driver.PostgresDriver.api._
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
      val searchIdFO = saveSearch(sessionId, city, adwords)

      saveAttributeSearch(searchIdFO, tags).flatMap(attrRow => FutureO(db.run(insertAttributeSearchesQuery(attrRow))))

      searchIdFO.future
    }

  def saveCitySearch(sessionId: String, city: String, adwords: Int): Future[Option[Int]] =
    (for {
      location ← FutureO(db.run(locationQuery(city).result.headOption))
      searchId ← FutureO(db.run(insertSearchQuery(sessionId, adwords, location, None)).map(Some(_)))
    } yield searchId).future

  private def saveSearch(sessionId: String, city: String, adwords: Int) =
    for {
      location ← FutureO(db.run(locationQuery(city).result).map(_.headOption))
      searchId ← FutureO(db.run(insertSearchQuery(sessionId, adwords, location, None)).map(Some(_)))
    } yield searchId

  private def saveAttributeSearch(searchIdFO: FutureO[Int], tags: Seq[String]) =
    for {
      searchId ← searchIdFO
      attr     ← FutureO(db.run(attributeQuery(tags).result).map(Some(_)))
      attrRow  = attr.map(buildAttributeSearchRow(searchId, _))
    } yield attrRow

  private def attributeLocationQuery(tags: Seq[String], city: String) =
    for {
      l ← Location  if l.city === city
      a ← Attribute if a.name inSetBind tags
    } yield (a, l)

  private def hostelQuery(name: String) =
    Hostel.filter(_.name === name)

  private def attributeQuery(tags: Seq[String]) =
    for (a ← Attribute if a.name inSetBind tags) yield a

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
