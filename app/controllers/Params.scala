package controllers

case class SearchQueryParams(gclid: Option[String], ad: Option[String])

case class StatsBodyParams(hostelId: Int, searchId: Int)