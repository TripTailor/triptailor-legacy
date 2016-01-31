package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import classification.HostelsClassifier
import db.{HostelsDAO, LocationsDAO, SearchesDAO, TagsDAO}
import extensions.FutureO
import models.{ClassifiedHostel, Location, TagHolder}
import play.api.data.Form
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import play.api.{Configuration, Play}
import services.{HostelDetailsPriceScraper, HostelImageUrlsBuilder, HostelPriceScraper, PricingInfo}

import scala.concurrent.Future

@Singleton
class SearchController @Inject()(dbConfigProvider: DatabaseConfigProvider,
                                 locationsDAO: LocationsDAO,
                                 hostelsDAO: HostelsDAO,
                                 searchesDAO: SearchesDAO,
                                 tagsDAO: TagsDAO,
                                 config: Configuration) extends Controller {

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
        location             ← FutureO(loadLocation(location))
        scraper              = new HostelPriceScraper(config)
        tags                 = tagsQuery.split("-")
        (pricingInfo, model) ← loadModelPricingInfo(location, scraper, dateFrom, dateTo, tags)
        adWords              = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID             ← FutureO(searchesDAO.saveTagsSearch(sessionId, tags, location.city, adWords))
        classifier           = new HostelsClassifier(config, TagHolder.ClicheTags)
        classified           = classifier.classifyByTags(model.toSeq, tags)
      } yield (searchID, scraper.assignPricing(classified, pricingInfo))

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  def displayAll(location: String, dateFrom: String, dateTo: String) = Action.async { implicit request =>
    val queryParams = adWordsParamsBinding.bindFromRequest.get
    val sessionId   = request.session.get("id").getOrElse(generateId)

    val fOpt =
      for {
        location             ← FutureO(loadLocation(location))
        scraper              = new HostelPriceScraper(config)
        (pricingInfo, model) ← loadModelPricingInfo(location, scraper, dateFrom, dateTo, Seq())
        adWords              = if (queryParams.ad.isEmpty && queryParams.gclid.isEmpty) 0 else 1
        searchID             ← FutureO(searchesDAO.saveCitySearch(sessionId, location.city, adWords))
        classifier           = new HostelsClassifier(config, TagHolder.ClicheTags)
        classified           = classifier.classifyByTags(model.toSeq, tags = Seq(""))
      } yield (searchID, scraper.assignPricing(classified, pricingInfo))

    fOpt.future.map(_ getOrElse (-1, Seq.empty)).map(resultsToResponse)
  }

  def detail(name: String, tagsQuery: String) = Action.async { implicit request =>
    for {
      hostel           ← hostelsDAO.loadHostelWithReviews(name)
      parameters       = tagsQuery.replace("-", " ").replace("%21", "-")
      classifier       = new HostelsClassifier(config, TagHolder.ClicheTags)
      classified       = classifier.classifyByTags(Seq(hostel), parameters.split("[ ,]"))
      imageUrlsBuilder = new HostelImageUrlsBuilder(config)
      classifiedHostel = classified.head
      json             = Json toJson classifiedHostel
    } yield Ok(views.html.detail(classifiedHostel, imageUrlsBuilder.hostelWorldUrls(classifiedHostel.hostel), json))
  }

  /**
    * Queries for hostel details, including reviews & pricing info
    *
    * @param name hostel name to query for
    * @param tagsQuery set of tags for classification
    * @return hostel json details
    */
  def detailJson(name: String, tagsQuery: String) = Action.async { implicit request =>
    val params        = detailsParamsBinding.bindFromRequest.get
    val hostelFuture  = hostelsDAO.loadHostelWithReviews(name)
    val pricingFuture = hostelsDAO.loadHostelUrl(name).flatMap(urlOpt => loadHostelPricingInfo(urlOpt, params))

    for {
      hostel       ← hostelFuture
      pricingOpt   ← pricingFuture
      pricedHostel = pricingOpt.fold(hostel)(pricing => hostel.copy(price = pricing.price, currency = pricing.currency))
      parameters   = tagsQuery.replace("-", " ").replace("%21", "-")
      classifier   = new HostelsClassifier(config, TagHolder.ClicheTags)
      classified   = classifier.classifyByTags(Seq(pricedHostel), parameters.split("[ ,]"))
    } yield Ok(Json toJson classified.head)
  }

  private def loadModelPricingInfo(location: Location, scraper: HostelPriceScraper, dateFrom: String, dateTo: String, tags: Seq[String]) = {
    val pricingInfoFuture = scraper.pricingInfo(location.city, location.country, dateFrom, dateTo)
    val modelFuture       = hostelsDAO.loadModelWithReviews(location.city, location.country, tags)
    for {
      pricingInfo ← FutureO(pricingInfoFuture.map(Some(_)))
      model       ← FutureO(modelFuture.map(Some(_)))
    } yield (pricingInfo, model)
  }

  private def loadHostelPricingInfo(urlOpt: Option[java.net.URL], params: DetailsParams) =
    urlOpt.fold {
      Future.successful[Option[PricingInfo]](None)
    } { url =>
      new HostelDetailsPriceScraper(config).pricingInfoDetails(url.toString, params.dateFrom, params.dateTo)
        .map(Some.apply)
    }

  private def loadLocation(location: String) =
    location.replace("-", " ").split(",").map(_.replaceAll("[^a-zA-Z -]", "")) match {
      case Array(city, country) =>
        locationsDAO.loadLocationWithCountry(city, country)
      case Array(city) =>
        locationsDAO.loadLocation(city)
    }

  private def resultsToResponse(searchIDResults: (Int, Seq[ClassifiedHostel])) =
    Ok(Json.obj("searchID" -> searchIDResults._1, "classifiedHostels" -> Json.toJson(searchIDResults._2)))

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
