package models

case class ClassifiedHostel(hostel: Hostel, rating: Double, orderedTags: Seq[TagHolder])