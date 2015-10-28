package controllers

import javax.inject.{Inject, Singleton}

import db.{TagsDAO, HostelsDAO, LocationsDAO}
import models.TagHolder
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import play.api.data.Form
import play.api.data.Forms._

import scala.concurrent.Future

@Singleton
class HintsController @Inject()(dbConfigProvider: DatabaseConfigProvider, locationsDAO: LocationsDAO, tagsDAO: TagsDAO)
  extends Controller {

  def hostelHints = Action.async { implicit request =>
    val queryParams = hintsParamsBinding.bindFromRequest.get

    val results =
      queryParams match {
        case HintsParams(Some(tags), None) =>
          tagsDAO.tagsQuery(tags.toLowerCase())
        case HintsParams(None, Some(locations)) =>
          locationsDAO.locationHints(locations.replaceAll("-", " "))
      }

    results.map(r => Ok(Json.toJson(r)))
  }

  def tagSuggestions = Action.async { implicit request =>
    val queryParams = suggestionsParamsBinding.bindFromRequest.get

    val tagSuggestionsFuture =
      queryParams match {
        case TagsSuggestions(Some(location), optionalTags) =>
          val chosenTagsOpt = optionalTags.map(_.replace("-", " ").replace("%21", "-").split("[ ,]"))
          tagSuggestionsFor(location, chosenTagsOpt.fold(TagHolder.ClicheTags)(TagHolder.ClicheTags ++ _))
        case TagsSuggestions(_, _) =>
          Future.successful(Seq.empty[String])
      }

    tagSuggestionsFuture.map { results =>
      Ok(Json.toJson(results))
    }
  }

  private def tagSuggestionsFor(location: String, tagsToExclude: Set[String]) =
    location.replace("-", " ").split(",").map(_.replaceAll("[^a-zA-Z -]", "")) match {
      case Array(city, country) =>
        tagsDAO.tagSuggestions(city, country, tagsToExclude)
      case Array(city) =>
        Future.successful(Seq.empty[String])
    }

  private val hintsParamsBinding = Form(
    mapping(
      "tags"      -> optional(nonEmptyText),
      "locations" -> optional(nonEmptyText)
    )(HintsParams.apply)(HintsParams.unapply)
  )

  private val suggestionsParamsBinding = Form(
    mapping(
      "location" -> optional(nonEmptyText),
      "tags"     -> optional(nonEmptyText)
    )(TagsSuggestions.apply)(TagsSuggestions.unapply)
  )

}
