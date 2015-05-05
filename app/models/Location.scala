package models

case class Location(
  id: Int,
  city: String,
  country: String,
  commonTags: Seq[String],
  commonServices: Set[String]
)