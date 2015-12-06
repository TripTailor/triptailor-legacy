package controllers

import javax.inject.{Inject, Singleton}

import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._
import play.api.routing.JavaScriptReverseRouter

@Singleton
class ApplicationController @Inject()(dbConfigProvider: DatabaseConfigProvider) extends Controller {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

  def howItWorks = Action { implicit request =>
    Ok(views.html.howItWorks())
  }

  def javascriptRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter.apply("jsRoutes")(
        routes.javascript.Assets.at,
        routes.javascript.ApplicationController.index,
        routes.javascript.ApplicationController.howItWorks,
        routes.javascript.HintsController.hostelHints,
        routes.javascript.HintsController.tagSuggestions,
        routes.javascript.SearchController.search,
        routes.javascript.SearchController.classify,
        routes.javascript.SearchController.displayAll,
        routes.javascript.SearchController.detail,
        routes.javascript.SearchController.detailJson,
        routes.javascript.StatsController.saveHostelClick
      )
    ).as("text/javascript")
  }

}
