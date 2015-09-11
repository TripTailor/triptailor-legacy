package models

import play.api.Play
import play.api.libs.json.{Json, Writes}

import scala.math.BigDecimal.RoundingMode

import services.HostelImageUrlsBuilder

case class ClassifiedHostel(hostel: Hostel, rating: Double, orderedTags: Seq[TagHolder])

object ClassifiedHostel {
  implicit val classifiedHostelWrites = new Writes[ClassifiedHostel] {
    def writes(ch: ClassifiedHostel) = Json.obj(
      "id"     -> ch.hostel.id,
      "name"   -> ch.hostel.name,
      "price"  -> ch.hostel.price.map(_.setScale(2, RoundingMode.HALF_EVEN)),
      "images" -> new HostelImageUrlsBuilder(Play.current.configuration).hostelWorldUrls(ch.hostel),
      "url"    -> ch.hostel.url,
      "tags"   -> ch.orderedTags
    )
  }
}
