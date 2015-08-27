package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}
import classification.HostelsClassifier
import db.{HostelsDAO, LocationsDAO, SearchesDAO, TagsDAO}
import extensions.FutureO
import models.{ClassifiedHostel, TagHolder}
import play.api.{Logger, Play}
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import scala.concurrent.Future
import play.api.libs.json.JsValue
import play.api.libs.json.JsArray
import org.jsoup.Connection
import org.jsoup.Jsoup

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO,
                                 tagsDAO: TagsDAO) extends Controller {

  private val logger = Logger(this.getClass)

  def search = Action.async { implicit request =>
    val locationParams = locationTagsParamsBinding.bindFromRequest.get

    val fOptLocation =
      locationParams match {
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
    val queryParams = adWordsParamsBinding.bindFromRequest.get
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
        adWords        = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID       ← if (hostel.nonEmpty) FutureO(searchesDAO.saveHostelSearch(sessionId, hostel.name, location.city, adWords))
                         else FutureO(searchesDAO.saveTagsSearch(sessionId, parameters.split("[ ,]"), location.city, adWords))
        _              = logger.info(s"saved search $searchID")
        classifier     = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified     = if (hostel.nonEmpty) classifier.classify(model.toSeq, hostel)
                         else classifier.classifyByTags(model.toSeq, parameters.split("[ ,]"))
      } yield (searchID, classified)

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  def displayAll(location: String) = Action.async { implicit request =>
    val queryParams = adWordsParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location   ← FutureO(loadLocation(location))
        _          = logger.info(s"loaded location $location")
        model      ← FutureO(hostelsDAO.loadModel(location.city, location.country).map(Some(_)))
        _          = logger.info("loaded model")
        adWords    = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID   ← FutureO(searchesDAO.saveCitySearch(sessionId, location.city, adWords))
        _          = logger.info(s"saved search $searchID")
        classifier = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified = classifier.classifyByTags(model.toSeq, tags = Seq(""))
      } yield (searchID, classified)

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  private def resultsToResponse(searchIDResults: (Int, Seq[ClassifiedHostel])) =
    Ok(Json.obj("searchID" -> searchIDResults._1, "classifiedHostels" -> Json.toJson(searchIDResults._2)))

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

  private val adWordsParamsBinding = Form(
    mapping(
      "gclid" -> optional(nonEmptyText),
      "ad"    -> optional(nonEmptyText)
    )(AdWordsParams.apply)(AdWordsParams.unapply)
  )

  private def generateId = UUID.randomUUID().toString
  
  def getCurrentHostels(country: String, city: String, from: String, to: String) = {
    def get(url: String, connectTimeout:Int =5000, readTimeout:Int =5000, requestMethod: String = "GET") = {
      import java.net.{URL, HttpURLConnection}
      val connection = (new URL(url)).openConnection.asInstanceOf[HttpURLConnection]
      connection.setConnectTimeout(connectTimeout)
      connection.setReadTimeout(readTimeout)
      connection.setRequestMethod(requestMethod)
      connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36")
      val inputStream = connection.getInputStream
      val content = io.Source.fromInputStream(inputStream).mkString
      if (inputStream != null) inputStream.close
      content
    }
    
    val url = "http://www.hostelworld.com/static/js/1.32.14.4/properties-ajax-"
    val response: Connection.Response = Jsoup.connect("http://www.hostelworld.com/search?country=" + country + "&city=" + city + "&date_from=" + from + "&date_to=" + to)
                                      .timeout(10 * 1000)
                                      .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36")
                                      .execute()
    val key: String = response.parse().select("#jsnResKey").first().attr("value")
    val json: JsValue = (Json.parse(get(url + key)) \ "data").get
    val data: Seq[JsValue] = json.as[JsArray].as[Seq[JsValue]]
    
    case class HostelPricingInfo(id: String, price: Option[BigDecimal])
    data map { hostelJson => HostelPricingInfo(id = (hostelJson \ "pid").as[String], price = (hostelJson \ "dpr").asOpt[String].map(BigDecimal.apply)) }
  }
}
