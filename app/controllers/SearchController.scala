package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import classification.HostelsClassifier
import db.{HostelsDAO, LocationsDAO, SearchesDAO}
import extensions.FutureO
import models.{Location, ClassifiedHostel, TagHolder}
import play.api.Play
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Result, Action, Controller}

import scala.concurrent.Future

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO) extends Controller {

  def classify(cityQuery: String, paramsQuery: String) = Action.async { implicit request =>
    val queryParams = queryParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val city = cityQuery.replace("-", " ").replaceAll("%21", "-").split(",").head.replaceAll("[^a-zA-Z -]", "")

    val fOpt =
      for {
        location       ← FutureO(locationsDAO.loadLocation(city, TagHolder.ClicheTags))
        _ = println("loading location")
        model          ← FutureO(hostelsDAO.loadModel(location.city, location.country).map(Some(_)))
        _ = println("loading model")
        parameters     = paramsQuery.replace("-", " ").replace("%21", "-")
        possibleHostel = parameters.split(",").head.mkString
//        hostel         ← FutureO(hostelsDAO.loadHostel(possibleHostel).map(Some(_)))
        hostel         ← FutureO(Future(model.find(_.name == possibleHostel)))
        adwords        = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchId       ← if (hostel.nonEmpty) FutureO(searchesDAO.saveHostelSearch(sessionId, hostel.name, location.city, adwords))
                         else FutureO(searchesDAO.saveTagsSearch(sessionId, parameters.split("[ ,]"), location.city, adwords))
        _ = println("saving tag search")
        classifier     = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified     = if (hostel.nonEmpty) classifier.classify(model.toSeq, hostel)
                         else classifier.classifyByTags(model.toSeq, parameters.split("[ ,]"))
      } yield (classified, location, searchId)

    mapSearchResultToHttpResult(fOpt.future, sessionId)
  }

  def displayAll(location: String) = Action.async { implicit request =>
    val queryParams = queryParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val city = location.replace("-", " ").split(",").head.replaceAll("[^a-zA-Z -]", "")

    val fOpt =
      for {
        location   ← FutureO(locationsDAO.loadLocation(city, TagHolder.ClicheTags))
        _ = println("loading location")
        model      ← FutureO(hostelsDAO.loadModel(location.city, location.country).map(Some(_)))
        _ = println("loading model")
        adwords    = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchId   ← FutureO(searchesDAO.saveCitySearch(sessionId, location.city, adwords))
        _ = println("saving search")
        classifier = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified = classifier.classifyByTags(model.toSeq, tags = Seq(""))
      } yield (classified, location, searchId)

    mapSearchResultToHttpResult(fOpt.future, sessionId)
  }

  private def mapSearchResultToHttpResult(future: Future[Option[(Seq[ClassifiedHostel], Location, Int)]],
                              sessionId: String): Future[Result] =
    future.map { searchResultOpt =>
      searchResultOpt.fold {
        Ok(views.html.hostels(Seq(), None, None))
      } {
        case (classifiedHostels, location, searchId) =>
          Ok(views.html.hostels(classifiedHostels, Some(location), Some(searchId))).withSession("id" -> sessionId)
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