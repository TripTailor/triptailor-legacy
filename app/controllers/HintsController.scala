package controllers

import javax.inject.{Inject, Singleton}

import db.{HostelsDAO, LocationsDAO}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

@Singleton
class HintsController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                hostelsDAO: HostelsDAO,
                                locationsDAO: LocationsDAO) extends Controller {

  def hostelHints(query: String) = Action.async {
    hostelsDAO.getHostelHints(query).map { result =>
      Ok(Json.toJson(result))
    }
  }

  def locationHints(query: String) = Action.async {
    locationsDAO.getLocationHints(query).map { result =>
      Ok(Json.toJson(result))
    }
  }

}
