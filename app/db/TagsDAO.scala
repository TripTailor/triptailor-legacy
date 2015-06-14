package db

import javax.inject.{Singleton, Inject}

import play.api.db.slick.{HasDatabaseConfigProvider, DatabaseConfigProvider}
import slick.profile.RelationalProfile

import slick.driver.MySQLDriver.api._
import scala.concurrent.Future

import db.Tables._

@Singleton
class TagsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
  extends HasDatabaseConfigProvider[RelationalProfile]  {

  def tagsQuery(query: String): Future[Seq[String]] = {
    val q = for (a ← Attribute if a.name like s"$query%") yield a.name
    db.run(q.take(10).result)
  }

  def tagSuggestions(city: String, country: String, tagsToExclude: Seq[String]): Future[Seq[String]] =
    db.run(tagsQuery(city, country, tagsToExclude))

  private def tagsQuery(city: String, country: String, tagsToExclude: Seq[String]) = {
    val Suggestions = 10
    val excluded    = s"""(${tagsToExclude.map("'" + _ + "'").mkString(", ")})"""

    sql"""
       select name from (
         select a.name, ha.rating
         from location l, hostel h, attribute a, hostel_attribute ha
         where l.city = $city and l.country = $country and h.location_id = l.id and h.id = ha.hostel_id and a.id = ha.attribute_id and a.name not in #$excluded
         order by ha.rating desc
       ) as q1
       group by name
       order by rating desc
       limit $Suggestions;
    """.as[String]
  }

}
