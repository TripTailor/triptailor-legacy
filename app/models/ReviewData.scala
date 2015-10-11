package models

import org.joda.time.DateTime
import play.api.libs.json.{Json, Writes}

case class AttributePositions(name: String, positions: String)
case class ReviewData(
  attributePositions: Seq[AttributePositions],
  text: String,
  year: Option[DateTime],
  reviewer: Option[String],
  city: Option[String],
  gender: Option[String],
  age: Option[Int]
)

object AttributePositions {
  implicit val attributePositionWrites = new Writes[AttributePositions] {
    def writes(ap: AttributePositions) = Json.obj(
      "tag"       -> ap.name,
      "positions" -> ap.positions
    )
  }
}

object ReviewData {
  implicit val reviewDataWrites = new Writes[ReviewData] {
    def writes(rd: ReviewData) = Json.obj(
      "tagPositions" -> Json.toJson(rd.attributePositions),
      "text"         -> rd.text,
      "year"         -> rd.year,
      "reviewer"     -> rd.reviewer,
      "city"         -> rd.city,
      "gender"       -> rd.gender,
      "age"          -> rd.age
    )
  }
}