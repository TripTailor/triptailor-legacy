package controllers

import javax.inject.{Inject, Singleton}

import db.StatsDAO
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._
import play.api.routing.JavaScriptReverseRouter

@Singleton
class ApplicationController @Inject()(dbConfigProvider: DatabaseConfigProvider) extends Controller {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

  def javascriptRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter.apply("jsRoutes")(
        routes.javascript.ApplicationController.index,
        routes.javascript.HintsController.hostelHints,
        routes.javascript.HintsController.tagSuggestions,
        routes.javascript.SearchController.search,
        routes.javascript.SearchController.classify,
        routes.javascript.SearchController.displayAll
      )
    ).as("text/javascript")
  }

}
