package db

import com.google.inject.{ Inject, Singleton }

import play.api.db.slick._

import slick.driver.MySQLDriver.api._
import slick.profile.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import db.Tables._

@Singleton
class HostelsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
  extends HasDatabaseConfigProvider[RelationalProfile] {

  def loadModel2(city: String, country: String): Future[Seq[models.Hostel]] =
    for {
      hostels    ← db.run(hostelQuery(city, country).result)
      _ = println("loaded hostels")
      attributes ← Future.sequence(hostels.map(h => db.run(hostelAttributesQuery(h.id).result)))
      _ = println("loaded attributes for hostels")
      hostel     = hostels zip attributes map { case (h, haa) => createHostel(h, haa) }
      _ = println("creating hostels")
    } yield hostel

  def loadModel(city: String, country: String): Future[Iterable[models.Hostel]] = {
    val hostels      = hostelQuery(city, country)
    val hostelsAttrs = hostelWithAttributesQuery(hostels)

    val f = db.run(hostelsAttrs.result)
    f.map(groupByHostelRows).map(createHostels)
  }

  def loadHostel(name: String): Future[models.Hostel] = {
    val hostels     = hostelQuery(name)
    val hostelAttrs = hostelWithAttributesQuery(hostels)

    val f = db.run(hostelAttrs.result)
    f.map(groupByHostelRows).map(createHostels).map(_.headOption getOrElse models.Hostel.empty)
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

  private def hostelWithAttributesQuery(hostels: Query[Hostel, HostelRow, Seq]) =
    for {
      hostel ← hostels
      ha     ← HostelAttribute if hostel.id === ha.hostelId
      attr   ← Attribute       if attr.id === ha.attributeId
    } yield (hostel, attr.name, ha.rating)

  private def hostelNameAndCityQuery(query: String) =
    for {
      (h, l) ← Hostel join Location on (_.locationId === _.id)
      if (l.city like query) || (h.name like query)
    } yield (h.name, l.city)

  private def hostelAttributesQuery(hid: Int) =
    for {
      (ha, a) ← HostelAttribute join Attribute on (_.attributeId === _.id)
      if ha.hostelId === hid
    } yield (ha, a)

  private def attributesQuery(possibleTag: String): Query[Rep[String],String,Seq] =
    for {
      attr ← Attribute if attr.name like possibleTag
    } yield attr.name

  private def createHostel(h: HostelRow, attributes: Seq[(HostelAttributeRow, AttributeRow)]) = {
    def seqOp(n: Double, haa: (HostelAttributeRow, AttributeRow)) = haa._1.rating
    def combOp(n: Double, rating: Double) = n + rating

    val n = attributes.aggregate(0d)(seqOp, combOp)
    val attributeRatings =
      attributes.foldLeft( Map.empty[String,Double] ) { case (acc, (ha, a)) =>
        acc + (a.name -> (ha.cfreq / n) * (ha.rating / ha.freq))
      }
    models.Hostel(h.id, h.name, h.noReviews, h.price.map(_.toDouble).map(BigDecimal.apply), h.url, attributeRatings)
  }

  private def createHostels(hostelRowWithAttrs: Map[HostelRow, Map[String,Double]]): Iterable[models.Hostel] =
    for ((h, attrs) ← hostelRowWithAttrs) yield {
      models.Hostel(
        id          = h.id,
        name        = h.name,
        noReviews   = h.noReviews,
        price       = h.price.map(_.toDouble).map(BigDecimal.apply),
        url         = h.url,
        attributes  = attrs
      )
    }

  private def groupByHostelRows(hostelAttrs: Seq[(HostelRow,String,Double)]): Map[HostelRow, Map[String,Double]] =
    hostelAttrs.groupBy(_._1) mapValues { row =>
      row.map {
        case (_, attr, rating) => (attr, rating)
      }.toMap
    }

  private def groupHostelsAndAttributes(hostelsNamesCities: Seq[(String,String)], attributes: Seq[String]): Map[String, Seq[String]] =
    Map(
      "hostels" -> hostelsNamesCities.map(tuple => tuple._1 + "," + tuple._2),
      "tags"    -> attributes
    )

}
