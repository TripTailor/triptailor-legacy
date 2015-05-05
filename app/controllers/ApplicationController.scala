package controllers

import javax.inject.{Inject, Singleton}

import db.StatsDAO
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._

@Singleton
class ApplicationController @Inject() (dbConfigProvider: DatabaseConfigProvider, statsDAO: StatsDAO) extends Controller {

  def index = Action { request =>
    Ok(views.html.index())
  }

}
