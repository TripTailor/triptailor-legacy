package models

case class Hostel(
  id: Long,
  name: String,
  noReviews: Int,
  price: Option[BigDecimal],
  imageUrlsText: String,
  url: Option[String],
  hostelworldId: Option[Int],
  attributes: Map[String,Double],
  description: Option[String] = None,
  currency: Option[String] = None
) {
  def isEmpty  = id == 0
  def nonEmpty = !isEmpty
}

object Hostel {
  def empty: Hostel = Hostel(0, "", 0, None, "", None, None, Map.empty)
}
