package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import classification.HostelsClassifier
import db.{HostelsDAO, LocationsDAO, SearchesDAO, TagsDAO}
import extensions.FutureO
import models.TagHolder
import play.api.{Logger, Play}
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import scala.concurrent.Future

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO,
                                 tagsDAO: TagsDAO) extends Controller {

  private val logger = Logger(this.getClass)

  def search = Action.async { implicit request =>
    val queryParams = locationTagsParamsBinding.bindFromRequest.get

    val fOptLocation =
      queryParams match {
        case HintsParams(_, Some(location)) =>
          loadLocation(location)
        case HintsParams(_, _) =>
          Future.successful(None)
      }

    fOptLocation.map { locationOpt =>
      Ok(views.html.hostels(locationOpt))
    }
  }

  def classify(location: String, tagsQuery: String) = Action.async { implicit request =>
    val queryParams = queryParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location       ← FutureO(loadLocation(location))
        _              = logger.info(s"loaded location $location")
        model          ← FutureO(hostelsDAO.loadModel(location.city, location.country).map(Some(_)))
        _              = logger.info("loaded model")
        parameters     = tagsQuery.replace("-", " ").replace("%21", "-")
        possibleHostel = parameters.split(",").head.mkString
        hostel         ← FutureO(hostelsDAO.loadHostel(possibleHostel).map(Some(_)))
        adwords        = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchId       ← if (hostel.nonEmpty) FutureO(searchesDAO.saveHostelSearch(sessionId, hostel.name, location.city, adwords))
                         else FutureO(searchesDAO.saveTagsSearch(sessionId, parameters.split("[ ,]"), location.city, adwords))
        _              = logger.info(s"saved search $searchId")
        classifier     = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified     = if (hostel.nonEmpty) classifier.classify(model.toSeq, hostel)
                         else classifier.classifyByTags(model.toSeq, parameters.split("[ ,]"))
      } yield classified

    fOpt.future.map(_ getOrElse Seq.empty) map { results =>
      Ok(Json.toJson(results))
    }
  }

  def displayAll(location: String) = Action.async { implicit request =>
    val queryParams = queryParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location   ← FutureO(loadLocation(location))
        _          = logger.info(s"loaded location $location")
        model      ← FutureO(hostelsDAO.loadModel(location.city, location.country).map(Some(_)))
        _          = logger.info("loaded model")
        adwords    = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchId   ← FutureO(searchesDAO.saveCitySearch(sessionId, location.city, adwords))
        _          = logger.info(s"saved search $searchId")
        classifier = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified = classifier.classifyByTags(model.toSeq, tags = Seq(""))
      } yield classified

    fOpt.future.map(_ getOrElse Seq.empty) map { results =>
      Ok(Json.toJson(results))
    }
  }

  private def loadLocation(location: String) =
    location.replace("-", " ").split(",").map(_.replaceAll("[^a-zA-Z -]", "")) match {
      case Array(city, country) =>
        locationsDAO.loadLocationWithCountry(city, country)
      case Array(city) =>
        locationsDAO.loadLocation(city)
    }

  private val locationTagsParamsBinding = Form(
    mapping(
      "tags"      -> optional(nonEmptyText),
      "location"  -> optional(nonEmptyText)
    )(HintsParams.apply)(HintsParams.unapply)
  )

  private val queryParamsBinding = Form(
    mapping(
      "gclid" -> optional(nonEmptyText),
      "ad"    -> optional(nonEmptyText)
    )(SearchQueryParams.apply)(SearchQueryParams.unapply)
  )

  private def generateId = UUID.randomUUID().toString
}
