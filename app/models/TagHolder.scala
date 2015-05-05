package models

import scala.io.Source

case class TagHolder(attribute: String, rating: Double, tagType: Int) {
  def isShared: Boolean = tagType == 0
  def isUnique: Boolean = !isShared
}

object TagHolder {
  lazy val ClicheTags: Set[String] = Source.fromFile("cliche_tags.txt").getLines.toSet
}