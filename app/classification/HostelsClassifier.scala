package classification

import com.google.inject.Inject
import models.{ClassifiedHostel, Hostel, TagHolder}
import play.api.Configuration

trait HostelsClassifierConfig { self: HostelsClassifier =>
  lazy val TotalTags  = config.getInt("classifier.hostels.model.totalTags").get
  lazy val WeightBase = config.getDouble("classifier.hostels.model.weightBase").get
}

class HostelsClassifier @Inject()(protected val config: Configuration, protected val clicheTags: Set[String])
  extends HostelsClassifierConfig {

  /**
   * m: Individual Hostel taken from model
   * shared_har: Shared H attributes with ratings with respect to m
   * diff_har: Different H attributes with ratings with respect to m
   * unique_mar: Unique m attributes with ratings with respect to H
   *
   * @param model collection of Hostels used to compare with H
   * @param H Hostel used to draw comparison against m
   * @return ordered collection of ClassifiedHostel
   */
  def classify(model: Seq[Hostel], H: Hostel): Seq[ClassifiedHostel] = {
    import HostelsClassifier.{hcAscendingOrdering, tagDescendingOrdering}

    val reviews          = model.maxBy(_.noReviews).noReviews
    val highestNoReviews = if (H.noReviews < reviews) H.noReviews else reviews

    (for {
      m                      ← (H +: model).toStream
      nameWords              = m.name.split("\\s+").map(_.toLowerCase)
      (shared_har, diff_har) = H.attributes.partition(har => m.attributes contains har._1)
      unique_mar             = m.attributes -- H.attributes.keys
      sharedTags             = createTags(shared_har, TagHolder.SharedType, nameWords, m).sorted take TotalTags
      uniqueTags             = createTags(unique_mar, TagHolder.UniqueType, nameWords, m).sorted take (TotalTags - sharedTags.size)
      orderedTags            = (sharedTags ++ uniqueTags).sorted
      rating                 = computeRating(shared_har, m) + computeRating(diff_har, m)
      penalizedRating        = computeHostelPenalizedRating(m, highestNoReviews + 1, rating)
    } yield ClassifiedHostel(m, penalizedRating, orderedTags)).filter(_.orderedTags.nonEmpty).sorted.distinct
  }

  /**
   * m: Individual Hostel taken from model
   * shared_tar: Shared tags attributes with ratings with respect to m
   * unique_mar: Unique model attributes with ratings with respect to m
   *
   * @param model collection of Hostels used to compare with H
   * @param tags tags used to draw comparison with m
   * @return ordered collection of ClassifiedHostel
   */
  def classifyByTags(model: Seq[Hostel], tags: Seq[String]) = {
    import HostelsClassifier.{hcDescendingOrdering, tagDescendingOrdering}

    val averageNoReviews = model.foldLeft(0)(_ + _.noReviews) / model.size

    (for {
      m               ← model.toStream
      nameWords       = m.name.split("\\s+").map(_.toLowerCase)
      shared_tar      = m.attributes.filter(mar => tags contains mar._1)
      unique_mar      = m.attributes -- tags
      sharedTags      = createTags(shared_tar, TagHolder.SharedType, nameWords, m).sorted take TotalTags
      uniqueTags      = createTags(unique_mar, TagHolder.UniqueType, nameWords, m).sorted take (TotalTags - sharedTags.size)
      orderedTags     = (sharedTags ++ uniqueTags).sorted
      rating          = shared_tar.values.sum / tags.size
      penalizedRating = computeTagPenalizedRating(m, averageNoReviews + 1, rating)
    } yield ClassifiedHostel(m, penalizedRating, orderedTags)).filter(_.orderedTags.nonEmpty).sorted
  }

  private def createTags(ar: Map[String,Double], tagType: Int, nameWords: Seq[String], m: Hostel): Seq[TagHolder] = {
    def condition(attr: String) = !clicheTags.contains(attr) && !nameWords.contains(attr)

    ar.toSeq.flatMap { case (a, r) =>
      if (condition(a))
        Some(TagHolder(a, m.attributes(a), tagType))
      else
        None
    }
  }

  private def computeRating(har: Map[String,Double], m: Hostel): Double =
    har.foldLeft( 0d ) { case (rating, (ha, hr)) =>
      rating + computeEuclideanDistance(hr, m.attributes.getOrElse(ha, 0d))
    }

  private def computeHostelPenalizedRating(m: Hostel, highestNoReviews: Int, rating: Double): Double = {
    val modelReviews = m.noReviews + 1
    val reviewRatio  = highestNoReviews / modelReviews
    (rating * math.pow(WeightBase, reviewRatio)) / WeightBase
  }

  private def computeTagPenalizedRating(m: Hostel, averageNoReviews: Int, rating: Double): Double = {
    val modelReviews = m.noReviews + 1
    val reviewRatio  = if (averageNoReviews / modelReviews < 1) 1 else averageNoReviews / modelReviews
    (rating / math.pow(WeightBase, reviewRatio)) * WeightBase
  }

  private def computeEuclideanDistance(x1: Double, x2: Double) = math.pow(x1 - x2, 2)
}

object HostelsClassifier {
  implicit val tagDescendingOrdering: Ordering[TagHolder] = Ordering.by[TagHolder, Double](-_.rating)

  implicit val hcAscendingOrdering: Ordering[ClassifiedHostel]  = Ordering.by[ClassifiedHostel, Double](_.rating)
  implicit val hcDescendingOrdering: Ordering[ClassifiedHostel] = Ordering.by[ClassifiedHostel, Double](-_.rating)
}