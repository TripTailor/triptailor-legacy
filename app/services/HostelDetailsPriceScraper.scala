package services

import javax.inject.Inject

import org.jsoup.Jsoup
import org.jsoup.nodes.{Document, Element}

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
    val doc = Jsoup.parse(html)
    val currencyOpt = extractCurrencyOpt(doc)
    val elements = doc.select(".currency").iterator().asScala.toStream
    elements.filter(hasPrice).map(el => parsePrice(el, parseDormType(el), currencyOpt))
  }

  private def extractCurrencyOpt(doc: Document) =
    doc.select("#currency_list option").iterator.asScala.toList.find(_.attr("selected").trim == "true")
      .map(_.attr("value").trim)

  private def parsePrice(element: Element, dormType: DormType, currencyOpt: Option[String]) =
    element.text match {
      case NumericPriceRegex(price) => PricingInfo(Some(BigDecimal(price)), dormType, currencyOpt)
    }

  private def parseDormType(element: Element) = {
    val dormCode = element.attr("id")
    if (dormCode contains PrivateCode) PrivateDorm
    else if (dormCode contains PublicCode) PublicDorm
    else if (dormCode contains MixedCode) PublicDorm
    else PublicDorm
  }

  private def hasPrice(element: Element) = element.text.nonEmpty
  private def nonZeroPrices(pricingInfos: Seq[PricingInfo]) = pricingInfos.filter(_.price.exists(_ != 0))
  private def sortByLowestPrice(pricingInfos: Seq[PricingInfo]) = pricingInfos.sortBy(_.price.get)

}

object HostelDetailsPriceScraper {
  private val PrivateCode = "Private"
  private val PublicCode  = "Male"
  private val MixedCode   = "Mixed"

  private val NumericPriceRegex = """.*?(\d+\.?\d+)""".r
}