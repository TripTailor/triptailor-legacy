package controllers

import javax.inject.{Inject, Singleton}

import db.StatsDAO
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Result, Action, Controller}

import scala.concurrent.Future

@Singleton
class StatsController @Inject() (dbConfigProvider: DatabaseConfigProvider, statsDAO: StatsDAO) extends Controller {

  def saveHostelClick = Action.async { implicit request =>
    statsParamsBinding.bindFromRequest.fold(
      hasErrors = _ => Future(NotFound),
      success   = saveStats
    )
  }

  def stats = Action.async {
    val timestamp = DateTime.now.withTime(0, 0, 0, 0).getMillis
    val todayStatsFuture    = statsDAO.getStats(timestamp)
    val completeStatsFuture = statsDAO.getStats(0L)

    for {
      todayStats    ← todayStatsFuture
      completeStats ← completeStatsFuture
    } yield Ok(views.html.stats(todayStats, completeStats))
  }

  private def saveStats(statsBody: StatsBodyParams): Future[Result] =
    statsDAO.saveHostelClick(statsBody.searchId, statsBody.hostelId).map(_ => Created)

  private val statsParamsBinding = Form(
    mapping(
      "hostelId" -> number,
      "searchId" -> number
    )(StatsBodyParams.apply)(StatsBodyParams.unapply)
  )

}