package services

import javax.inject.Inject

import org.jsoup.Jsoup
import org.jsoup.nodes.Element

import play.api.Configuration
import play.api.Play.current
import play.api.libs.ws.WS
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import scala.collection.JavaConverters._
import scala.concurrent.Future

class HostelDetailsPriceScraper @Inject() (config: Configuration) {
  import HostelDetailsPriceScraper._

  def pricingInfoDetails(uri: String, dateFrom: String, dateTo: String): Future[PricingInfo] =
    pricingInfoDetailsRequest(uri, dateFrom, dateTo).map(_.body).map(extractPricingTableElements)
      .map(nonZeroPrices).map(sortByLowestPrice).map(_.head)

  private def pricingInfoDetailsRequest(uri: String, dateFrom: String, dateTo: String) =
    WS.url(uri).withQueryString("dateFrom" -> dateFrom, "dateTo" -> dateTo).get()

  private def extractPricingTableElements(html: String) = {
    val elements = Jsoup.parse(html).select(".currency").iterator().asScala.toStream
    elements.filter(hasPrice).map(el => parsePrice(el, parseDormType(el)))
  }

  private def hasPrice(element: Element) = element.text.nonEmpty

  private def nonZeroPrices(pricingInfos: Seq[PricingInfo]) = pricingInfos.filter(_.price.exists(_ != 0))

  private def sortByLowestPrice(pricingInfos: Seq[PricingInfo]) = pricingInfos.sortBy(_.price.get)

  private def parsePrice(element: Element, dormType: DormType) =
    element.text match {
      case PriceDataRegex(currency, price) => PricingInfo(Some(BigDecimal(price)), dormType, Some(currency))
    }

  private def parseDormType(element: Element) = {
    val dormCode = element.attr("id")
    if (dormCode contains PrivateCode) PrivateDorm
    else if (dormCode contains PublicCode) PublicDorm
    else if (dormCode contains MixedCode) PublicDorm
    else PublicDorm
  }
}

object HostelDetailsPriceScraper {
  private val PrivateCode = "Private"
  private val PublicCode  = "Male"
  private val MixedCode   = "Mixed"

  private val PriceDataRegex = """(\D+)(\d+\.?\d+)""".r
}