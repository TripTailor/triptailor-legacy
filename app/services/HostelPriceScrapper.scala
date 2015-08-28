import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.JsValue
import play.api.libs.ws.WS

import scala.concurrent.Future

case class HostelPricingInfo(id: String, price: Option[BigDecimal])

object HostelPricingScrapper {
  def pricingInfo(city: String, country: String, from: String, to: String): Future[Seq[HostelPricingInfo]] =
    for {
      response ← hostelWorldRequest("city" -> city, "country" -> country, "date_from" -> from, "date_to" -> to)
      data     = (response.json \ "data").as[Seq[JsValue]]
    } yield data.map(parseHostelPricingInfo)

  private def parseHostelPricingInfo(info: JsValue) =
    HostelPricingInfo(
      id    = (info \ "pid").as[String],
      price = (info \ "dpr").asOpt[String].map(BigDecimal.apply)
    )

  private def hostelWorldRequest(queryParams: (String, String)*) =
    WS.url("http://www.hostelworld.com/search").withQueryString(queryParams: _*).get()

}