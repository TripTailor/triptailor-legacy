package controllers

import javax.inject.{Inject, Singleton}

import db.{TagsDAO, HostelsDAO, LocationsDAO}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import play.api.data.Form
import play.api.data.Forms._

@Singleton
class HintsController @Inject()(dbConfigProvider: DatabaseConfigProvider, locationsDAO: LocationsDAO, tagsDAO: TagsDAO)
  extends Controller {

  def hostelHints = Action.async { implicit request =>
    val queryParams = hintsParamsBinding.bindFromRequest.get

    val results =
      queryParams match {
        case HintsParams(Some(tags), None) =>
          tagsDAO.tagsQuery(tags)
        case HintsParams(None, Some(locations)) =>
          locationsDAO.locationHints(locations)
      }

    results.map(r => Ok(Json.toJson(r)))
  }

  def tagSuggestions(location: String, tags: String) = Action.async { implicit request =>
    val city       = location.replace("-", " ").split(",").head.replaceAll("[^a-zA-Z -]", "")
    val chosenTags = tags.replace("-", " ").replace("%21", "-").split("[ ,]")

    tagsDAO.tagSuggestions(city, chosenTags).map { results =>
      Ok(Json.toJson(results))
    }
  }

  private val hintsParamsBinding = Form(
    mapping(
      "tags"      -> optional(nonEmptyText),
      "locations" -> optional(nonEmptyText)
    )(HintsParams.apply)(HintsParams.unapply)
  )

}
