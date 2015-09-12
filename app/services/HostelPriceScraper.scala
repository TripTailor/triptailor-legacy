package services

import java.util.concurrent.TimeoutException
import javax.inject.{Inject, Singleton}

import org.jsoup.Jsoup
import play.api.Configuration
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.JsValue
import play.api.libs.ws.WS

import scala.concurrent.Future
import scala.util.control.NonFatal

sealed trait DormType
case object PublicDorm extends DormType
case object PrivateDorm extends DormType
case object UnknownDorm extends DormType

case class PricingInfo(price: Option[BigDecimal], dormType: DormType, currency: Option[String])
case class HostelPricingInfo(id: String, pricingInfo: PricingInfo)

@Singleton
class HostelPriceScraper @Inject() (config: Configuration) {
  import HostelPriceScraper._

  val timeout = config.getMilliseconds("scraper.pricingInfo.timeout").get

  def retrievePricingInfo(city: String, country: String, dateFrom: String, dateTo: String): Future[Seq[HostelPricingInfo]] =
    retryRequestWithin(timeout) {
      tokenRequest("city" -> city, "country" -> country, "date_from" -> dateFrom, "date_to" -> dateTo) flatMap { token =>
        parsePricingInfo(token)
      }
    }

  private def tokenRequest(queryParams: (String, String)*): Future[String] =
    hostelworldSearchRequest(queryParams: _*)
      .map(_.body).map(retrieveToken)

  private def parsePricingInfo(token: String): Future[Seq[HostelPricingInfo]] =
    for {
      response ← jsonRequest(token)
      data     = (response.json \ "data").as[Seq[JsValue]]
    } yield data.map(parseHostelPricingInfo)

  private def parseHostelPricingInfo(info: JsValue) =
    HostelPricingInfo(
      id          = (info \ "pid").as[String],
      pricingInfo = parsePricingInfo(info)
    )

  private def parsePricingInfo(info: JsValue) =
    (info \ "dpr").asOpt[String].fold {
      (info \ "ppr").asOpt[String].map { value =>
        PricingInfo(Some(BigDecimal(value)), PrivateDorm, (info \ "c").asOpt[String])
      }.getOrElse(PricingInfo(None, UnknownDorm, None))
    } { value =>
      PricingInfo(Some(BigDecimal(value)), PublicDorm, (info \ "c").asOpt[String])
    }

  private def retrieveToken(html: String): String =
    Jsoup.parse(html).select("#jsnResKey").first().attr("value")

  private def hostelworldSearchRequest(queryParams: (String, String)*) =
    WS.url("http://www.hostelworld.com/search").withQueryString(queryParams: _*).withRequestTimeout(timeout).get()
    
  private def jsonRequest(token: String) =
    WS.url(s"http://www.hostelworld.com/static/js/1.32.14.4/properties-ajax-$token").withRequestTimeout(timeout).get()

}

object HostelPriceScraper {

  def retryRequestWithin[A](timeout: Long)(request: => Future[A]): Future[A] = {
    def retry(millis: Long): Future[A] = {
      val start = System.currentTimeMillis()
      request.recoverWith {
        case NonFatal(_) =>
          val remainingTime = millis - (System.currentTimeMillis() - start)
          if (remainingTime > 0)
            retry(remainingTime)
          else Future.failed(new TimeoutException(s"Timed out after $timeout millis"))
      }
    }

    retry(timeout)
  }

}
