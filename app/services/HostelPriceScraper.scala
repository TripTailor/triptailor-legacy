package services

import javax.inject.Inject
import play.api.Configuration
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.JsValue
import play.api.libs.ws.WS
import scala.concurrent.Future
import org.jsoup.Jsoup

case class HostelPricingInfo(id: String, price: Option[BigDecimal])

class HostelPriceScraper @Inject() (config: Configuration) {
  val timeout = config.getMilliseconds("scraper.pricingInfo.timeout").get
  
  def retrievePricingInfo(city: String, country: String, dateFrom: String, dateTo: String): Future[Seq[HostelPricingInfo]] =
    tokenRequest("city" -> city, "country" -> country, "date_from" -> dateFrom, "date_to" -> dateTo) flatMap { token =>
      parsePricingInfo(token)
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
      id    = (info \ "pid").as[String],
      price = (info \ "dpr").asOpt[String].orElse((info \ "ppr").asOpt[String]).map(BigDecimal.apply)
    )
    
  private def retrieveToken(html: String): String =
    Jsoup.parse(html).select("#jsnResKey").first().attr("value")

  private def hostelworldSearchRequest(queryParams: (String, String)*) =
    WS.url("http://www.hostelworld.com/search").withQueryString(queryParams: _*).withRequestTimeout(timeout).get()
    
  private def jsonRequest(token: String) =
    WS.url(s"http://www.hostelworld.com/static/js/1.32.14.4/properties-ajax-$token").withRequestTimeout(timeout).get()

}