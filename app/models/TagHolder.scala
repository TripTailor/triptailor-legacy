package models

import play.api.libs.json.{Json, Writes}

import scala.io.Source

case class TagHolder(attribute: String, rating: Double, tagType: Int) {
  import TagHolder.SharedType

  def isShared: Boolean = tagType == SharedType
  def isUnique: Boolean = !isShared
}

object TagHolder {
  lazy val ClicheTags: Set[String] = Source.fromFile("cliche_tags.txt").getLines.toSet

  val SharedType = 0
  val UniqueType = 1

  implicit val tagWrites = new Writes[TagHolder] {
    def writes(th: TagHolder) = Json.obj(
      "name" -> th.attribute,
      "type" -> th.tagType
    )
  }
}