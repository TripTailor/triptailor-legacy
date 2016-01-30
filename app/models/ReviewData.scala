package models

import db.HostelsDAO
import org.joda.time.DateTime
import play.api.libs.json.{Json, Writes}

case class Position(start: Int, end: Int)
object Position {
  private val PositionExtract = """\((\d+),(\d+)\)""".r

  def createPositions(positions: String) =
    for (PositionExtract(start, end) ← PositionExtract.findAllIn(positions)) yield Position(start.toInt, end.toInt)
}
case class AttributePositions(name: String, position: Position)
case class ReviewData(
  attributePositions: Seq[AttributePositions],
  text: String,
  year: Option[DateTime],
  reviewer: Option[String],
  city: Option[String],
  gender: Option[String],
  age: Option[Int],
  sentiment: BigDecimal
)

object AttributePositions {
  implicit val positionWrites = new Writes[Position] {
    def writes(pos: Position) = Json.toJson(Seq(pos.start, pos.end))
  }

  implicit val attributePositionWrites = new Writes[AttributePositions] {
    def writes(ap: AttributePositions) = Json.obj(
      "tag"       -> ap.name,
      "positions" -> ap.position
    )
  }

  def createAttributePositions(rows: Seq[HostelsDAO#AttrPositionReviewRow]) =
    (for {
      (attr, posStr, _) ← rows
      position          ← Position.createPositions(posStr)
    } yield AttributePositions(attr, position)).sortBy(_.position.start)
}

object ReviewData {
  implicit val reviewDataWrites = new Writes[ReviewData] {
    def writes(rd: ReviewData) = Json.obj(
      "tagPositions" -> rd.attributePositions,
      "text"         -> rd.text,
      "year"         -> rd.year,
      "reviewer"     -> rd.reviewer,
      "city"         -> rd.city,
      "gender"       -> rd.gender,
      "age"          -> rd.age,
      "sentiment"    -> rd.sentiment
    )
  }
}
