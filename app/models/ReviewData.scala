package models

import org.joda.time.DateTime
import play.api.libs.json.{Json, Writes}
import play.api.libs.json.JsArray

case class AttributePositions(name: String, positions: (Int, Int))
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
  implicit def tuple2Writes[A, B](implicit a: Writes[A], b: Writes[B]): Writes[Tuple2[A, B]] = new Writes[Tuple2[A, B]] {
    def writes(tuple: Tuple2[A, B]) = JsArray(Seq(a.writes(tuple._1), b.writes(tuple._2)))
  }
  
  implicit val attributePositionWrites = new Writes[AttributePositions] {
    def writes(ap: AttributePositions) = Json.obj(
      "tag"       -> ap.name,
      "positions" -> ap.positions
    )
  }
}

object ReviewData {
  implicit val ordering: Ordering[AttributePositions]  = Ordering.by[AttributePositions, Int](_.positions._1)
  
  implicit val reviewDataWrites = new Writes[ReviewData] {
    def writes(rd: ReviewData) = Json.obj(
      "tagPositions" -> Json.toJson(rd.attributePositions.sorted),
      "text"         -> rd.text,
      "year"         -> rd.year,
      "reviewer"     -> rd.reviewer,
      "city"         -> rd.city,
      "gender"       -> rd.gender,
      "age"          -> rd.age
    )
  }
}