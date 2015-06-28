package db

import com.google.inject.{Inject, Singleton}
import db.Tables._
import org.joda.time.DateTime
import play.api.db.slick._
import slick.driver.MySQLDriver.api._
import slick.profile.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class StatsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[RelationalProfile] {
  import models.Stats

  import scala.annotation.tailrec

  type StatsRowResult = (String, Boolean, Option[Int], Int)

  def saveHostelClick(searchId: Int, hostelId: Int): Future[Int] =
    db.run(insertHostelSearchQuery(hostelId, searchId, DateTime.now.getMillis))

  def getStats(timestamp: Long): Future[Stats] =
    db.run(statsQuery(timestamp).to[Set].result).map(createStats)

  // TODO: Verify data with site
  private def statsQuery(timestamp: Long) =
    for {
      (search, attrSearch) ← Search joinLeft AttributeSearch on (_.id === _.searchId)
      if search.timestamp >= timestamp
      linksPerSearch = HostelSearch.filter(hs => hs.searchId === search.id).size
    } yield {
      (search.sess, search.adwords, attrSearch.map(_.searchId), linksPerSearch)
    }

  private def insertHostelSearchQuery(hostelId: Int, searchId: Int, timestamp: Long) =
    HostelSearch += HostelSearchRow(hostelId, searchId, DateTime.now.getMillis)

  private def createStats(rows: Set[StatsRowResult]): Stats = {
    @tailrec
    def helper(rows: Set[StatsRowResult], noSearches: Int, noAdwords: Int, prevSession: String,
          noSess: Int, noLinksPerSearch: Int, noHostelSearches: Int, noAttrSearches: Int): Stats =
      if (rows.isEmpty) {
        Stats(
          searches          = noSearches,
          adwords           = noAdwords,
          searchSession     = noSearches / (noSess * 1.0),
          linkSearch        = noLinksPerSearch / (noSearches * 1.0),
          hostelSearches    = noHostelSearches,
          attributeSearches = noAttrSearches
        )
      } else {
        val (sess, hasAdwords, attributeSearches, linksPerSearch) = rows.head
        helper(
          rows             = rows.tail,
          noSearches       = noSearches + 1,
          noAdwords        = if (hasAdwords) noAdwords + 1 else noAdwords,
          prevSession      = sess,
          noSess           = if (prevSession == sess) noSess else noSess + 1,
          noLinksPerSearch = noLinksPerSearch + linksPerSearch,
          noHostelSearches = if (linksPerSearch == 0) noHostelSearches else noHostelSearches + 1,
          noAttrSearches   = attributeSearches.fold(noAttrSearches)(_ + 1)
        )
      }
    helper(rows, 0, 0, "", 0, 0, 0, 0)
  }

}
