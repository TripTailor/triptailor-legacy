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

  private def createHostel(hr: HostelRow, attrsRows: Seq[HostelAttrsRow]) =
    models.Hostel(
      id            = hr.id,
      name          = hr.name,
      noReviews     = hr.noReviews,
      price         = hr.price.map(_.toDouble).map(BigDecimal.apply),
      imageUrlsText = hr.images getOrElse "",
      url           = hr.url,
      hostelworldId = hr.hostelworldId,
      attributes    = createHostelAttributes(attrsRows),
      description   = hr.description
    )

  private def createHostelAttributes(attrsRows: Seq[HostelAttrsRow]) = {
    val n = attrsRows.foldLeft(0)((n, row) => n + row._2.toInt)
    attrsRows.foldLeft( Map.empty[String,Double] ) { case (attributes, (name, freq, cfreq, rating)) =>
      attributes + (name -> (cfreq / n) * (rating / freq))
    }
  }

}
