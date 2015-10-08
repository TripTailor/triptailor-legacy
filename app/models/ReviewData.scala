package models

import org.joda.time.DateTime

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