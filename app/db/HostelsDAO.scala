package db

import com.google.inject.{ Inject, Singleton }

import play.api.db.slick._

import slick.driver.PostgresDriver.api._
import slick.profile.RelationalProfile

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.Future

import db.Tables._

@Singleton
class HostelsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
  extends HasDatabaseConfigProvider[RelationalProfile] {

  type HostelAttrsRow = (String, Double, Double, Double)

  def loadModel(city: String, country: String): Future[Seq[models.Hostel]] =
    for {
      hostelRows ← db.run(hostelQuery(city, country).result)
      hostel     ← Future.sequence(hostelRows.map(createHostelWithAttributes))
    } yield hostel

  def loadHostel(name: String): Future[models.Hostel] = {
    val f =
      for {
        hostelRows ← db.run(hostelQuery(name).take(1).result)
        hostel     ← Future.sequence(hostelRows.map(createHostelWithAttributes))
      } yield hostel
    f.map(_.headOption getOrElse models.Hostel.empty)
  }

  def getHostelHints(query: String): Future[Map[String, Seq[String]]] = {
    val Limit = 10

    val sanitizedQuery = query.toLowerCase.replace("-", " ")

    val hostelNameCity = hostelNameAndCityQuery(s"%$sanitizedQuery%") take Limit
    val attributes     = attributesQuery(s"${sanitizedQuery.split(" ").last}%") take Limit

    val f1 = db.run(hostelNameCity.result)
    val f2 = db.run(attributes.result)

    for {
      r1 ← f1
      r2 ← f2
    } yield groupHostelsAndAttributes(r1, r2)
  }

  private def hostelQuery(name: String) =
    for {
      hostel ← Hostel if hostel.name === name
    } yield hostel

  private def hostelQuery(city: String, country: String) =
    for {
      (hostel, location) ← Hostel join Location on (_.locationId === _.id)
      if location.city === city && location.country === country
    } yield hostel

  private def createHostelWithAttributes(hostelRow: HostelRow): Future[models.Hostel] = {
    val sql =
      sql"""
        SELECT name, freq, cfreq, rating
        FROM   hostel_attribute, attribute
        WHERE  hostel_attribute.hostel_id = ${hostelRow.id}
        AND    hostel_attribute.attribute_id = attribute.id
      """.as[HostelAttrsRow]
    db.run(sql).map(createHostel(hostelRow, _))
  }

  private def hostelNameAndCityQuery(query: String) =
    for {
      (h, l) ← Hostel join Location on (_.locationId === _.id)
      if (l.city like query) || (h.name like query)
    } yield (h.name, l.city)

  private def attributesQuery(possibleTag: String): Query[Rep[String],String,Seq] =
    for {
      attr ← Attribute if attr.name like possibleTag
    } yield attr.name

  private def createHostel(hr: HostelRow, attrsRows: Seq[HostelAttrsRow]) =
    models.Hostel(
      id = hr.id,
      name = hr.name,
      noReviews = hr.noReviews,
      price = hr.price.map(_.toDouble).map(BigDecimal.apply),
      url = hr.url,
      attributes = createHostelAttributes(attrsRows)
    )

  private def createHostelAttributes(attrsRows: Seq[HostelAttrsRow]) = {
    val n = attrsRows.foldLeft(0)((n, row) => n + row._2.toInt)
    attrsRows.foldLeft( Map.empty[String,Double] ) { case (attributes, (name, freq, cfreq, rating)) =>
      attributes + (name -> (cfreq / n) * (rating / freq))
    }
  }

  private def groupHostelsAndAttributes(hostelsNamesCities: Seq[(String,String)], attributes: Seq[String]): Map[String, Seq[String]] =
    Map(
      "hostels" -> hostelsNamesCities.map(tuple => tuple._1 + "," + tuple._2),
      "tags"    -> attributes
    )

}
