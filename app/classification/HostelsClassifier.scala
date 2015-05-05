package classification

import com.google.inject.Inject
import models.{ClassifiedHostel, Hostel, TagHolder}
import play.api.Configuration

trait HostelsClassifierConfig { self: HostelsClassifier =>
  lazy val SharedTags = config.getInt("classifier.hostels.model.sharedTags").get
  lazy val UniqueTags = config.getInt("classifier.hostels.model.uniqueTags").get
  lazy val WeightBase = config.getInt("classifier.hostels.model.weightBase").get
}

class HostelsClassifier @Inject()(protected val config: Configuration, protected val clicheTags: Set[String]) extends HostelsClassifierConfig {

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
    println("classifying by hostel")
    import HostelsClassifier.{hcAscendingOrdering, tagDescendingOrdering}

    val highestNoReviews = model.maxBy(_.noReviews).noReviews

    (for {
      (m, i)                 ← model.zipWithIndex
      nameWords              = m.name.split("\\s+").map(_.toLowerCase)
      (shared_har, diff_har) = H.attributes.partition(har => m.attributes contains har._1)
      unique_mar             = m.attributes -- H.attributes.keys
      (nbrShared, nbrUnique) = if (m.name equalsIgnoreCase H.name) (SharedTags + UniqueTags, 0) else (SharedTags, UniqueTags)
      sharedTags             = createTags(shared_har, 0, nameWords).sorted take nbrShared
      uniqueTags             = createTags(unique_mar, 1, nameWords).sorted take nbrUnique
      orderedTags            = (sharedTags ++ uniqueTags).sorted
      rating                 = computeRating(shared_har, m) + computeRating(diff_har, m)
      penalizedRating        = computeHostelPenalizedRating(m, highestNoReviews + (i + 1), rating)
    } yield ClassifiedHostel(m, penalizedRating, orderedTags)).sorted
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
    println("classifying by tags")
    import HostelsClassifier.{hcDescendingOrdering, tagDescendingOrdering}

    val averageNoReviews = model.foldLeft(0d)(_ + _.noReviews) / model.size

    (for {
      (m, i)          ← model.zipWithIndex
      nameWords       = m.name.split("\\s+").map(_.toLowerCase)
      shared_tar      = m.attributes.filter(mar => tags contains mar._1)
      unique_mar      = m.attributes -- tags
      sharedTags      = createTags(shared_tar, 0, nameWords).sorted take SharedTags
      uniqueTags      = createTags(unique_mar, 1, nameWords).sorted take (SharedTags + UniqueTags - sharedTags.size)
      orderedTags     = (sharedTags ++ uniqueTags).sorted
      rating          = shared_tar.values.sum / tags.size
      penalizedRating = computeTagPenalizedRating(m, averageNoReviews + (i + 1), rating)
    } yield ClassifiedHostel(m, penalizedRating, orderedTags)).sorted
  }

  private def createTags(ar: Map[String,Double], tagType: Int, nameWords: Seq[String]): Seq[TagHolder] = {
    def condition(attr: String) = !clicheTags.contains(attr) && !nameWords.contains(attr)

    ar.toSeq.flatMap { case (a, r) =>
      if (condition(a))
        Some(TagHolder(a, r, tagType))
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

  private def computeTagPenalizedRating(m: Hostel, averageNoReviews: Double, rating: Double): Double = {
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