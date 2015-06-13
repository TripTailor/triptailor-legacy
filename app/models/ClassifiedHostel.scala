package models

import play.api.libs.json.{Json, Writes}

import scala.math.BigDecimal.RoundingMode

case class ClassifiedHostel(hostel: Hostel, rating: Double, orderedTags: Seq[TagHolder])

object ClassifiedHostel {
  implicit val classifiedHostelWrites = new Writes[ClassifiedHostel] {
    def writes(ch: ClassifiedHostel) = Json.obj(
      "name"  -> ch.hostel.name,
      "price" -> ch.hostel.price.map(_.setScale(2, RoundingMode.HALF_EVEN)),
      "url"   -> ch.hostel.url,
      "tags"  -> ch.orderedTags
    )
  }
}