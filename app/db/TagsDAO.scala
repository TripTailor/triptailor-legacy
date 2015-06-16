package db

import javax.inject.{Inject, Singleton}

import db.Tables._
import play.api.Configuration
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.driver.MySQLDriver.api._
import slick.profile.RelationalProfile

import scala.concurrent.Future

trait TagsDAOConfig { self: TagsDAO =>
  lazy val Suggestions = config.getInt("tags.suggestions").get
}

@Singleton
class TagsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider, protected val config: Configuration)
  extends HasDatabaseConfigProvider[RelationalProfile] with TagsDAOConfig {

  def tagsQuery(query: String): Future[Seq[String]] = {
    val q = for (a ← Attribute if a.name like s"$query%") yield a.name
    db.run(q.take(10).result)
  }

  def tagSuggestions(city: String, country: String, tagsToExclude: Set[String]): Future[Seq[String]] =
    db.run(tagsQuery(city, country, tagsToExclude))

  private def tagsQuery(city: String, country: String, tagsToExclude: Set[String]) = {
    val excluded = s"""(${tagsToExclude.map("'" + _ + "'").mkString(", ")})"""

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
