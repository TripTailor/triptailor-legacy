package db

import com.google.inject.{ Inject, Singleton }
import org.joda.time.DateTime

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
  type AttrPositionReviewRow = (String, String, ReviewRow)

  def loadModel(city: String, country: String): Future[Seq[models.Hostel]] =
    for {
      hostelRows ← db.run(hostelQuery(city, country).result)
      hostel     ← db.run(DBIO.sequence(hostelRows.map(createHostelWithAttributes(Seq.empty, _))))
    } yield hostel

  def loadHostel(name: String): Future[models.Hostel] = {
    val f =
      for {
        hostelRows  ← db.run(hostelQuery(name).take(1).result)
        reviewsData ← db.run(DBIO.sequence(hostelRows.map(createHostelReviewsData)))
        hostel      ← db.run(DBIO.sequence(hostelRows.zip(reviewsData).map(tuple => createHostelWithAttributes(tuple._2, tuple._1))))
      } yield hostel
    f.map(_.headOption getOrElse models.Hostel.empty)
  }

  def loadHostelUrl(name: String): Future[Option[java.net.URL]] =
    db.run(hostelQuery(name).take(1).result).map(_.headOption.flatMap(hostel => hostel.url.map(new java.net.URL(_))))

  private def hostelQuery(name: String) =
    for {
      hostel ← Hostel if hostel.name === name
    } yield hostel

  private def hostelQuery(city: String, country: String) =
    for {
      (hostel, location) ← Hostel join Location on (_.locationId === _.id)
      if location.city === city && location.country === country
    } yield hostel

  private def createHostelWithAttributes(reviewsData: Seq[models.ReviewData], hostelRow: HostelRow) = {
    val sql =
      sql"""
        SELECT name, freq, cfreq, rating
        FROM   hostel_attribute, attribute
        WHERE  hostel_attribute.hostel_id = ${hostelRow.id}
        AND    hostel_attribute.attribute_id = attribute.id
      """.as[HostelAttrsRow]
    sql.map(createHostel(reviewsData, hostelRow, _))
  }

  private def createHostelReviewsData(hostelRow: HostelRow) = {
    val Limit = 300
    val sql =
      sql"""
        SELECT   a.name, ar.positions, r.*
        FROM     attribute a, attribute_review ar, review r
        WHERE    a.id = ar.attribute_id AND ar.review_id = r.id AND hostel_id = ${hostelRow.id}
        GROUP BY r.id, a.name, ar.positions
      """.as[AttrPositionReviewRow]
    sql.map(createReviewsData).map(_.take(Limit))
  }

  private def createHostel(reviewsData: Seq[models.ReviewData], hr: HostelRow, attrsRows: Seq[HostelAttrsRow]) =
    models.Hostel(
      id            = hr.id,
      name          = hr.name,
      noReviews     = hr.noReviews,
      price         = hr.price.map(BigDecimal.apply),
      imageUrlsText = hr.images getOrElse "",
      url           = hr.url,
      hostelworldId = hr.hostelworldId,
      attributes    = createHostelAttributes(attrsRows),
      description   = hr.description,
      reviewsData   = reviewsData
    )

  private def createHostelAttributes(attrsRows: Seq[HostelAttrsRow]) = {
    val n = attrsRows.foldLeft(0)((n, row) => n + row._2.toInt)
    attrsRows.foldLeft( Map.empty[String,Double] ) { case (attributes, (name, freq, cfreq, rating)) =>
      attributes + (name -> (cfreq / n) * (rating / freq))
    }
  }

  private def createReviewsData(rows: Seq[AttrPositionReviewRow]) =
    rows.groupBy(triplet => triplet._3.id).values.toSeq.flatMap { case reviewRows =>
      if (reviewRows.isEmpty)
        Seq.empty[models.ReviewData]
      else {
        val review = reviewRows.head._3

        Seq(
          models.ReviewData(
            attributePositions = models.AttributePositions.createAttributePositions(reviewRows),
            text               = review.text,
            year               = review.year.map(year => new DateTime(year.getTime)),
            reviewer           = review.reviewer,
            city               = review.city,
            gender             = review.gender,
            age                = review.age
          )
        )
      }
    }.sortBy(_.year.fold(Long.MaxValue)(_.getMillis))

}
