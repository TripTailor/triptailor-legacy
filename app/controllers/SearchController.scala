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

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO,
                                 tagsDAO: TagsDAO) extends Controller {

  private val logger = Logger(this.getClass)

  def search = Action { implicit request =>
    Ok(views.html.hostels())
  }

  def classify(cityQuery: String, tagsQuery: String) = Action.async { implicit request =>
    val queryParams = queryParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val city = cityQuery.replace("-", " ").replaceAll("%21", "-").split(",").head.replaceAll("[^a-zA-Z -]", "")

    val fOpt =
      for {
        location       ← FutureO(locationsDAO.loadLocation(city))
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

    val city = location.replace("-", " ").split(",").head.replaceAll("[^a-zA-Z -]", "")

    val fOpt =
      for {
        location   ← FutureO(locationsDAO.loadLocation(city))
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

  private val queryParamsBinding = Form(
    mapping(
      "gclid" -> optional(nonEmptyText),
      "ad"    -> optional(nonEmptyText)
    )(SearchQueryParams.apply)(SearchQueryParams.unapply)
  )

  private def generateId = UUID.randomUUID().toString
}
