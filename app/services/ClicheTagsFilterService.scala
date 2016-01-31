package services

import javax.inject.{Singleton, Inject}

import com.google.inject.ImplementedBy
import play.api.Configuration

import scala.collection.JavaConverters._

@ImplementedBy(classOf[ClicheTagsFilter])
trait ClicheTagsFilterService {
  val clicheTags: Set[String]
}

@Singleton
class ClicheTagsFilter @Inject() (config: Configuration) extends ClicheTagsFilterService {
  val clicheTags = config.getStringList("classifier.hostels.clicheTags").get.asScala.toSet
}