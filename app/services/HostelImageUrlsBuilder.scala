package services

import models.Hostel
import play.api.Configuration

class HostelImageUrlsBuilder(config: Configuration) {
  private val endpoint = config.getString("s3.hostel.images.endpoint").get

  def hostelWorldUrls(hostel: Hostel): Seq[String] =
    hostel.hostelworldId.fold {
      Seq.empty[String]
    } { hostelWorldId =>
      hostel.imageUrlsText.trim.split(",").toSeq.filter(_.nonEmpty).map(hostelWorldUrl(hostelWorldId, _))
    }

  private def hostelWorldUrl(hostelWorldId: Int, image: String) = s"$endpoint/hostelworld/$hostelWorldId/$image"
}
