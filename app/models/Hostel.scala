package models

case class Hostel(
  id: Long,
  name: String,
  noReviews: Int,
  price: Option[BigDecimal],
  url: Option[String],
  attributes: Map[String,Double]
) {
  def isEmpty  = id == 0
  def nonEmpty = !isEmpty
}

object Hostel {
  def empty: Hostel = Hostel(0, "", 0, None, None, Map.empty)
}
