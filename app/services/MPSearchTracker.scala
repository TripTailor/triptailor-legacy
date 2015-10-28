package services

import com.mixpanel.mixpanelapi.{MixpanelAPI, ClientDelivery, MessageBuilder}
import org.json.JSONObject
import play.api.Configuration
import play.api.libs.json.{Json, Writes}
import services.MPSearchTracker.MPEvent

trait MPSearchTracker {
  protected def config: Configuration

  private val messageBuilder = new MessageBuilder(config.getString("mixpanel.token").get)
  private val mixpanelApi    = new MixpanelAPI()

  def trackMPEvents[E <: MPEvent : Writes](distinctId: String, events: E*): Unit = {
    val msgs     = events.map(buildMessage[E](distinctId))
    val delivery = new ClientDelivery
    msgs.foreach(delivery.addMessage)
    mixpanelApi.deliver(delivery)
  }

  def buildMessage[E <: MPEvent : Writes](distinctId: String)(event: E) =
    messageBuilder.event(distinctId, event.name, new JSONObject(Json.toJson(event).toString()))

}

object MPSearchTracker {
  sealed trait MPEvent { def name: String }
  case class Search(city: String, country: String, dateFrom: String, dateTo: Option[String], tags: Seq[String])
      extends MPEvent {
    def name = "Search"
  }
  case class Booking(hostel: String, city: String, country: String, dateFrom: String, dateTo: Option[String])
      extends MPEvent {
    def name = "Booking"
  }
  case class HostelClick(hostel: String, city: String, country: String, dateFrom: String, dateTo: Option[String])
      extends MPEvent {
    def name = "Hostel Click"
  }
  case class AlsoTryClick(hostel: String, selectedTag: String, tags: Seq[String]) extends MPEvent {
    def name = "Also Try"
  }
  case class ReviewFilter(hostel: String, selectedTag: String, tags: Seq[String]) extends MPEvent {
    def name = "Review Filter"
  }
  case class SearchExampleClick(city: String, country: String, tags: Seq[String]) extends MPEvent {
    def name = "Search Example Click"
  }
  case object HowItWorksClick extends MPEvent {
    def name = "How It Works Click"
  }

  implicit val searchFormat             = Json.writes[Search]
  implicit val bookingFormat            = Json.writes[Booking]
  implicit val hostelClickFormat        = Json.writes[HostelClick]
  implicit val alsoTryClickFormat       = Json.writes[AlsoTryClick]
  implicit val reviewFilterFormat       = Json.writes[ReviewFilter]
  implicit val searchExampleClickFormat = Json.writes[SearchExampleClick]
//  implicit val howItWorksClickFormat    = Json.writes[HowItWorksClick.type]
}