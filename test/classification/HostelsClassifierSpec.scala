package classification

import com.typesafe.config.ConfigFactory
import models.{TagHolder, Hostel}
import org.scalatest.{Matchers, WordSpec}
import play.api.Configuration

class HostelsClassifierSpec extends WordSpec with Matchers {
  import TagHolder.{SharedType, UniqueType}

  "#classify" should {
    "make the first classified hostel obtained from model be the same as H" in {
      val classifier = new HostelsClassifier(generateConfig(), clicheTags = Set())

      val H1 = Hostel(1, "1", 10, None, None, Map("a" -> 1))
      val H2 = Hostel(2, "2", 10, None, None, Map("b" -> 1))
      val H3 = Hostel(3, "3", 10, None, None, Map("c" -> 1))

      val model = Seq(H1, H2, H3)

      classifier.classify(model, H1).head.hostel shouldBe H1
      classifier.classify(model, H2).head.hostel shouldBe H2
      classifier.classify(model, H3).head.hostel shouldBe H3
    }

    "includes H as first classified hostel when model does not already include it" in {
      val classifier = new HostelsClassifier(generateConfig(), clicheTags = Set())

      val H1 = Hostel(1, "1", 10, None, None, Map("a" -> 1))
      val H2 = Hostel(2, "2", 10, None, None, Map("b" -> 1))
      val H3 = Hostel(3, "3", 10, None, None, Map("c" -> 1))

      val model = Seq(H1, H2, H3)
      val H     = Hostel(4, "4", 10, None, None, Map("d" -> 1.0))

      val classified = classifier.classify(model, H)
      classified should have size 4
      classified.head.hostel shouldBe H
    }

    "compute a correct number of shared and unique tags based on config arguments" in {
      val tags1 = ('a' to 'r').map(_.toString)
      val tags2 = ('s' to 'z').map(_.toString)

      val totalTagsCount = tags1.size + tags2.size
      val classifier     = new HostelsClassifier(generateConfig(totalTagsCount), clicheTags = Set())

      val H1 = Hostel(1, "1", 10, None, None, tags1.map(_ -> 1.0).toMap)
      val H2 = Hostel(2, "2", 10, None, None, tags1.map(_ -> 2.0).toMap ++ tags2.map(_ -> 2.0).toMap)

      val model = Seq(H1, H2)

      val classified = classifier.classify(model, H1)
      classified.head.orderedTags.count(_.tagType == SharedType) shouldEqual tags1.size
      classified.head.orderedTags.count(_.tagType == UniqueType) shouldEqual 0
      classified.last.orderedTags.count(_.tagType == SharedType) shouldEqual tags1.size
      classified.last.orderedTags.count(_.tagType == UniqueType) shouldEqual tags2.size

      val classifier2 = new HostelsClassifier(generateConfig(tags1.size, tags2.size), clicheTags = Set())
      val classified2 = classifier2.classify(model, H1)
      classified2.head.orderedTags.count(_.tagType == SharedType) shouldEqual math.min(tags1.size + tags2.size, H1.attributes.size)
      classified2.head.orderedTags.count(_.tagType == UniqueType) shouldEqual 0
      classified2.last.orderedTags.count(_.tagType == SharedType) shouldEqual tags1.size
      classified2.last.orderedTags.count(_.tagType == UniqueType) shouldEqual 0
    }
  }

  "#classifyByTags" should {
    "compute a correct number of shared and unique tags specified by config" in {
      val tags1  = ('a' to 'g').map(_.toString)
      val tags2  = ('h' to 'm').map(_.toString)

      val classifier = new HostelsClassifier(generateConfig(totalTags = tags1.size + tags2.size), clicheTags = Set())

      val model = Seq(Hostel(1, "1", 10, None, None, (tags1 ++ tags2).map(_ -> 1.0).toMap))

      val classified = classifier.classifyByTags(model, tags1)
      classified.head.orderedTags.count(_.tagType == SharedType) shouldEqual tags1.size
      classified.last.orderedTags.count(_.tagType == UniqueType) shouldEqual tags2.size
    }

    "make the first classified hostel be the one with the highest ranked matching tags" in {
      val classifier = new HostelsClassifier(generateConfig(totalTags = 6), clicheTags = Set())

      val tags1 = ('a' to 'e').map(_.toString)
      val tags2 = ('c' to 'f').map(_.toString)
      val tags3 = ('d' to 'g').map(_.toString)

      val sameRating = 1.0

      val H1 = Hostel(1, "1", 10, None, None, tags1.map(_ -> sameRating).toMap)
      val H2 = Hostel(2, "2", 10, None, None, tags2.map(_ -> sameRating).toMap)
      val H3 = Hostel(3, "3", 10, None, None, tags3.map(_ -> sameRating).toMap)

      val model = Seq(H1, H2, H3)

      val classified = classifier.classifyByTags(model, tags1)
      classified.map(_.hostel) shouldBe Seq(H1, H2, H3)

      val classified2 = classifier.classifyByTags(model, tags2)
      classified2.map(_.hostel) shouldBe Seq(H2, H1, H3)

      val classified3 = classifier.classifyByTags(model, tags3)
      classified3.map(_.hostel) shouldBe Seq(H3, H2, H1)
    }

    "return classified hostels containing tags with higher ratings first" in {
      val classifier = new HostelsClassifier(generateConfig(totalTags = 6), clicheTags = Set())

      val tags           = ('a' to 'c').map(_.toString)
      val highRatingTags = Map("c" -> 10.0, "d" -> 10.0)

      val H1 = Hostel(1, "1", 10, None, None, tags.map(_ -> 1.0).toMap)
      val H2 = Hostel(2, "2", 10, None, None, highRatingTags)

      val model = Seq(H1, H2)

      val classified = classifier.classifyByTags(model, tags)
      classified.map(_.hostel) shouldBe Seq(H2, H1)

      classified.head.orderedTags.count(_.tagType == SharedType) shouldEqual 1
      classified.head.orderedTags.count(_.tagType == UniqueType) shouldEqual 1

      classified.last.orderedTags.count(_.tagType == SharedType) shouldEqual 3
      classified.last.orderedTags.count(_.tagType == UniqueType) shouldEqual 0
    }
  }

  private def generateConfig(totalTags: Int = 3, weightBase: Double = 1.5): Configuration =
    Configuration(
      ConfigFactory.parseString(
        s"""
          | classifier {
          |   hostels {
          |     model {
          |       totalTags  = $totalTags
          |       weightBase = $weightBase
          |     }
          |   }
          | }
        """.stripMargin
      )
    )

}