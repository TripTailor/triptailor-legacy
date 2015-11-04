package controllers

case class AdWordsParams(gclid: Option[String], ad: Option[String])

case class StatsBodyParams(hostelId: Int, searchId: Int)

case class HintsParams(tags: Option[String], locations: Option[String])

case class TagsSuggestions(city: Option[String], tags: Option[String])

case class DetailsParams(dateFrom: String, dateTo: String)
