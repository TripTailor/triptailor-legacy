package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import classification.HostelsClassifier
import db.{HostelsDAO, LocationsDAO, SearchesDAO, TagsDAO}
import extensions.FutureO
import models.{Hostel, Location, ClassifiedHostel, TagHolder}
import play.api.{Configuration, Logger, Play}
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

import services.{HostelDetailsPriceScraper, HostelImageUrlsBuilder, HostelPriceScraper}

import scala.concurrent.Future

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO,
                                 tagsDAO: TagsDAO,
                                 config: Configuration) extends Controller {

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

  def classify(location: String, tagsQuery: String, dateFrom: String, dateTo: String) = Action.async { implicit request =>
    val queryParams = adWordsParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location         ← FutureO(loadLocation(location))
        _                = logger.info(s"loaded location $location")
        scraper          = new HostelPriceScraper(config)
        pricingInfoModel ← loadPricingInfoAndModel(location, scraper, dateFrom, dateTo)
        pricingInfo      = pricingInfoModel._1
        model            = pricingInfoModel._2
        parameters       = tagsQuery.replace("-", " ").replace("%21", "-")
        possibleHostel   = parameters.split(",").head.mkString
        hostel           ← FutureO(hostelsDAO.loadHostel(possibleHostel).map(Some(_)))
        adWords          = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID         ← if (hostel.nonEmpty) FutureO(searchesDAO.saveHostelSearch(sessionId, hostel.name, location.city, adWords))
                           else FutureO(searchesDAO.saveTagsSearch(sessionId, parameters.split("[ ,]"), location.city, adWords))
        _                = logger.info(s"saved search $searchID")
        classifier       = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified       = if (hostel.nonEmpty) classifier.classify(model.toSeq, hostel)
                         else classifier.classifyByTags(model.toSeq, parameters.split("[ ,]"))
      } yield (searchID, scraper.assignPricing(classified, pricingInfo))

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  def displayAll(location: String, dateFrom: String, dateTo: String) = Action.async { implicit request =>
    val queryParams = adWordsParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location         ← FutureO(loadLocation(location))
        _                = logger.info(s"loaded location $location")
        scraper          = new HostelPriceScraper(config)
        pricingInfoModel ← loadPricingInfoAndModel(location, scraper, dateFrom, dateTo)
        pricingInfo      = pricingInfoModel._1
        model            = pricingInfoModel._2
        adWords          = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID         ← FutureO(searchesDAO.saveCitySearch(sessionId, location.city, adWords))
        _                = logger.info(s"saved search $searchID")
        classifier       = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified       = classifier.classifyByTags(model.toSeq, tags = Seq(""))
      } yield (searchID, scraper.assignPricing(classified, pricingInfo))

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  def detail(name: String, tagsQuery: String) = Action.async { implicit request =>
    val queryParams = detailsParamsBinding.bindFromRequest.get

    val classifiedHostelsFuture =
      for {
        hostel       ← hostelsDAO.loadHostel(name)
        pricedHostel ← hostelWithScrapedPrice(hostel, queryParams)
        parameters   = tagsQuery.replace("-", " ").replace("%21", "-")
        classifier   = new HostelsClassifier(Play.current.configuration, TagHolder.ClicheTags)
        classified   = classifier.classifyByTags(Seq(pricedHostel), parameters.split("[ ,]"))
      } yield classified

    classifiedHostelsFuture map { classifiedHostels =>
      val imageUrlsBuilder = new HostelImageUrlsBuilder(config)
      val classifiedHostel = classifiedHostels.head
      val json             = Json toJson classifiedHostel
      Ok(views.html.detail(classifiedHostel, imageUrlsBuilder.hostelWorldUrls(classifiedHostel.hostel), json))
    }
  }

  private def resultsToResponse(searchIDResults: (Int, Seq[ClassifiedHostel])) =
    Ok(Json.obj("searchID" -> searchIDResults._1, "classifiedHostels" -> Json.toJson(searchIDResults._2)))

  private def loadPricingInfoAndModel(location: Location, scraper: HostelPriceScraper, dateFrom: String, dateTo: String) = {
    val pricingInfoFuture = scraper.pricingInfo(location.city, location.country, dateFrom, dateTo)
    val modelFuture       = hostelsDAO.loadModel(location.city, location.country)
    for {
      pricingInfo ← FutureO(pricingInfoFuture.map(Some(_)))
      _           = logger.info("loaded pricing info")
      model       ← FutureO(modelFuture.map(Some(_)))
      _           = logger.info("loaded model")
    } yield (pricingInfo, model)
  }

  private def hostelWithScrapedPrice(hostel: Hostel, params: DetailsParams) =
    hostel.url.fold {
      Future.successful(hostel)
    } { url =>
      for {
        pricingInfo ← new HostelDetailsPriceScraper(config).pricingInfoDetails(url, params.dateFrom, params.dateTo)
      } yield hostel.copy(price = pricingInfo.price, currency = pricingInfo.currency)
    }

  private def loadLocation(location: String) =
    location.replace("-", " ").split(",").map(_.replaceAll("[^a-zA-Z -]", "")) match {
      case Array(city, country) =>
        locationsDAO.loadLocationWithCountry(city, country)
      case Array(city) =>
        locationsDAO.loadLocation(city)
    }

  private val detailsParamsBinding = Form(
    mapping(
      "date-from" -> nonEmptyText,
      "date-to"   -> nonEmptyText
    )(DetailsParams.apply)(DetailsParams.unapply)
  )

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
}
