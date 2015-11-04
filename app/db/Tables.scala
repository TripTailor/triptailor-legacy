package db
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = slick.driver.PostgresDriver
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.driver.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema = Array(Attribute.schema, AttributeReview.schema, AttributeSearch.schema, Hostel.schema, HostelAttribute.schema, HostelSearch.schema, HostelService.schema, Location.schema, PlayEvolutions.schema, Review.schema, Search.schema, Service.schema, Share.schema).reduceLeft(_ ++ _)
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table Attribute
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(varchar), Length(200,true) */
  case class AttributeRow(id: Int, name: String)
  /** GetResult implicit for fetching AttributeRow objects using plain SQL queries */
  implicit def GetResultAttributeRow(implicit e0: GR[Int], e1: GR[String]): GR[AttributeRow] = GR{
    prs => import prs._
    AttributeRow.tupled((<<[Int], <<[String]))
  }
  /** Table description of table attribute. Objects of this class serve as prototypes for rows in queries. */
  class Attribute(_tableTag: Tag) extends Table[AttributeRow](_tableTag, "attribute") {
    def * = (id, name) <> (AttributeRow.tupled, AttributeRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(name)).shaped.<>({r=>import r._; _1.map(_=> AttributeRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(varchar), Length(200,true) */
    val name: Rep[String] = column[String]("name", O.Length(200,varying=true))
  }
  /** Collection-like TableQuery object for table Attribute */
  lazy val Attribute = new TableQuery(tag => new Attribute(tag))

  /** Entity class storing rows of table AttributeReview
   *  @param attributeId Database column attribute_id SqlType(int4)
   *  @param reviewId Database column review_id SqlType(int4)
   *  @param positions Database column positions SqlType(text) */
  case class AttributeReviewRow(attributeId: Int, reviewId: Int, positions: String)
  /** GetResult implicit for fetching AttributeReviewRow objects using plain SQL queries */
  implicit def GetResultAttributeReviewRow(implicit e0: GR[Int], e1: GR[String]): GR[AttributeReviewRow] = GR{
    prs => import prs._
    AttributeReviewRow.tupled((<<[Int], <<[Int], <<[String]))
  }
  /** Table description of table attribute_review. Objects of this class serve as prototypes for rows in queries. */
  class AttributeReview(_tableTag: Tag) extends Table[AttributeReviewRow](_tableTag, "attribute_review") {
    def * = (attributeId, reviewId, positions) <> (AttributeReviewRow.tupled, AttributeReviewRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(attributeId), Rep.Some(reviewId), Rep.Some(positions)).shaped.<>({r=>import r._; _1.map(_=> AttributeReviewRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column attribute_id SqlType(int4) */
    val attributeId: Rep[Int] = column[Int]("attribute_id")
    /** Database column review_id SqlType(int4) */
    val reviewId: Rep[Int] = column[Int]("review_id")
    /** Database column positions SqlType(text) */
    val positions: Rep[String] = column[String]("positions")

    /** Primary key of AttributeReview (database name attribute_review_pkey) */
    val pk = primaryKey("attribute_review_pkey", (attributeId, reviewId))
  }
  /** Collection-like TableQuery object for table AttributeReview */
  lazy val AttributeReview = new TableQuery(tag => new AttributeReview(tag))

  /** Entity class storing rows of table AttributeSearch
   *  @param attributeId Database column attribute_id SqlType(int4)
   *  @param searchId Database column search_id SqlType(int4) */
  case class AttributeSearchRow(attributeId: Int, searchId: Int)
  /** GetResult implicit for fetching AttributeSearchRow objects using plain SQL queries */
  implicit def GetResultAttributeSearchRow(implicit e0: GR[Int]): GR[AttributeSearchRow] = GR{
    prs => import prs._
    AttributeSearchRow.tupled((<<[Int], <<[Int]))
  }
  /** Table description of table attribute_search. Objects of this class serve as prototypes for rows in queries. */
  class AttributeSearch(_tableTag: Tag) extends Table[AttributeSearchRow](_tableTag, "attribute_search") {
    def * = (attributeId, searchId) <> (AttributeSearchRow.tupled, AttributeSearchRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(attributeId), Rep.Some(searchId)).shaped.<>({r=>import r._; _1.map(_=> AttributeSearchRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column attribute_id SqlType(int4) */
    val attributeId: Rep[Int] = column[Int]("attribute_id")
    /** Database column search_id SqlType(int4) */
    val searchId: Rep[Int] = column[Int]("search_id")

    /** Primary key of AttributeSearch (database name attribute_search_pkey) */
    val pk = primaryKey("attribute_search_pkey", (attributeId, searchId))

    /** Foreign key referencing Attribute (database name attribute_search_ibfk_1) */
    lazy val attributeFk = foreignKey("attribute_search_ibfk_1", attributeId, Attribute)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Search (database name attribute_search_ibfk_2) */
    lazy val searchFk = foreignKey("attribute_search_ibfk_2", searchId, Search)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table AttributeSearch */
  lazy val AttributeSearch = new TableQuery(tag => new AttributeSearch(tag))

  /** Entity class storing rows of table Hostel
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(varchar), Length(200,true)
   *  @param description Database column description SqlType(text), Default(None)
   *  @param price Database column price SqlType(float8), Default(None)
   *  @param images Database column images SqlType(varchar), Length(500,true), Default(None)
   *  @param url Database column url SqlType(varchar), Length(400,true), Default(None)
   *  @param noReviews Database column no_reviews SqlType(int4)
   *  @param locationId Database column location_id SqlType(int4)
   *  @param hostelworldId Database column hostelworld_id SqlType(int4), Default(None) */
  case class HostelRow(id: Int, name: String, description: Option[String] = None, price: Option[Double] = None, images: Option[String] = None, url: Option[String] = None, noReviews: Int, locationId: Int, hostelworldId: Option[Int] = None)
  /** GetResult implicit for fetching HostelRow objects using plain SQL queries */
  implicit def GetResultHostelRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[String]], e3: GR[Option[Double]], e4: GR[Option[Int]]): GR[HostelRow] = GR{
    prs => import prs._
    HostelRow.tupled((<<[Int], <<[String], <<?[String], <<?[Double], <<?[String], <<?[String], <<[Int], <<[Int], <<?[Int]))
  }
  /** Table description of table hostel. Objects of this class serve as prototypes for rows in queries. */
  class Hostel(_tableTag: Tag) extends Table[HostelRow](_tableTag, "hostel") {
    def * = (id, name, description, price, images, url, noReviews, locationId, hostelworldId) <> (HostelRow.tupled, HostelRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(name), description, price, images, url, Rep.Some(noReviews), Rep.Some(locationId), hostelworldId).shaped.<>({r=>import r._; _1.map(_=> HostelRow.tupled((_1.get, _2.get, _3, _4, _5, _6, _7.get, _8.get, _9)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(varchar), Length(200,true) */
    val name: Rep[String] = column[String]("name", O.Length(200,varying=true))
    /** Database column description SqlType(text), Default(None) */
    val description: Rep[Option[String]] = column[Option[String]]("description", O.Default(None))
    /** Database column price SqlType(float8), Default(None) */
    val price: Rep[Option[Double]] = column[Option[Double]]("price", O.Default(None))
    /** Database column images SqlType(varchar), Length(500,true), Default(None) */
    val images: Rep[Option[String]] = column[Option[String]]("images", O.Length(500,varying=true), O.Default(None))
    /** Database column url SqlType(varchar), Length(400,true), Default(None) */
    val url: Rep[Option[String]] = column[Option[String]]("url", O.Length(400,varying=true), O.Default(None))
    /** Database column no_reviews SqlType(int4) */
    val noReviews: Rep[Int] = column[Int]("no_reviews")
    /** Database column location_id SqlType(int4) */
    val locationId: Rep[Int] = column[Int]("location_id")
    /** Database column hostelworld_id SqlType(int4), Default(None) */
    val hostelworldId: Rep[Option[Int]] = column[Option[Int]]("hostelworld_id", O.Default(None))

    /** Foreign key referencing Location (database name hostel_ibfk_1) */
    lazy val locationFk = foreignKey("hostel_ibfk_1", locationId, Location)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table Hostel */
  lazy val Hostel = new TableQuery(tag => new Hostel(tag))

  /** Entity class storing rows of table HostelAttribute
   *  @param hostelId Database column hostel_id SqlType(int4)
   *  @param attributeId Database column attribute_id SqlType(int4)
   *  @param freq Database column freq SqlType(float8)
   *  @param cfreq Database column cfreq SqlType(float8)
   *  @param rating Database column rating SqlType(float8) */
  case class HostelAttributeRow(hostelId: Int, attributeId: Int, freq: Double, cfreq: Double, rating: Double)
  /** GetResult implicit for fetching HostelAttributeRow objects using plain SQL queries */
  implicit def GetResultHostelAttributeRow(implicit e0: GR[Int], e1: GR[Double]): GR[HostelAttributeRow] = GR{
    prs => import prs._
    HostelAttributeRow.tupled((<<[Int], <<[Int], <<[Double], <<[Double], <<[Double]))
  }
  /** Table description of table hostel_attribute. Objects of this class serve as prototypes for rows in queries. */
  class HostelAttribute(_tableTag: Tag) extends Table[HostelAttributeRow](_tableTag, "hostel_attribute") {
    def * = (hostelId, attributeId, freq, cfreq, rating) <> (HostelAttributeRow.tupled, HostelAttributeRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(hostelId), Rep.Some(attributeId), Rep.Some(freq), Rep.Some(cfreq), Rep.Some(rating)).shaped.<>({r=>import r._; _1.map(_=> HostelAttributeRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column hostel_id SqlType(int4) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column attribute_id SqlType(int4) */
    val attributeId: Rep[Int] = column[Int]("attribute_id")
    /** Database column freq SqlType(float8) */
    val freq: Rep[Double] = column[Double]("freq")
    /** Database column cfreq SqlType(float8) */
    val cfreq: Rep[Double] = column[Double]("cfreq")
    /** Database column rating SqlType(float8) */
    val rating: Rep[Double] = column[Double]("rating")

    /** Primary key of HostelAttribute (database name hostel_attribute_pkey) */
    val pk = primaryKey("hostel_attribute_pkey", (hostelId, attributeId))

    /** Foreign key referencing Attribute (database name hostel_attribute_ibfk_2) */
    lazy val attributeFk = foreignKey("hostel_attribute_ibfk_2", attributeId, Attribute)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Hostel (database name hostel_attribute_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_attribute_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelAttribute */
  lazy val HostelAttribute = new TableQuery(tag => new HostelAttribute(tag))

  /** Entity class storing rows of table HostelSearch
   *  @param hostelId Database column hostel_id SqlType(int4)
   *  @param searchId Database column search_id SqlType(int4)
   *  @param timestamp Database column timestamp SqlType(int8) */
  case class HostelSearchRow(hostelId: Int, searchId: Int, timestamp: Long)
  /** GetResult implicit for fetching HostelSearchRow objects using plain SQL queries */
  implicit def GetResultHostelSearchRow(implicit e0: GR[Int], e1: GR[Long]): GR[HostelSearchRow] = GR{
    prs => import prs._
    HostelSearchRow.tupled((<<[Int], <<[Int], <<[Long]))
  }
  /** Table description of table hostel_search. Objects of this class serve as prototypes for rows in queries. */
  class HostelSearch(_tableTag: Tag) extends Table[HostelSearchRow](_tableTag, "hostel_search") {
    def * = (hostelId, searchId, timestamp) <> (HostelSearchRow.tupled, HostelSearchRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(hostelId), Rep.Some(searchId), Rep.Some(timestamp)).shaped.<>({r=>import r._; _1.map(_=> HostelSearchRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column hostel_id SqlType(int4) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column search_id SqlType(int4) */
    val searchId: Rep[Int] = column[Int]("search_id")
    /** Database column timestamp SqlType(int8) */
    val timestamp: Rep[Long] = column[Long]("timestamp")

    /** Primary key of HostelSearch (database name hostel_search_pkey) */
    val pk = primaryKey("hostel_search_pkey", (hostelId, searchId, timestamp))

    /** Foreign key referencing Hostel (database name hostel_search_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_search_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Search (database name hostel_search_ibfk_2) */
    lazy val searchFk = foreignKey("hostel_search_ibfk_2", searchId, Search)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelSearch */
  lazy val HostelSearch = new TableQuery(tag => new HostelSearch(tag))

  /** Entity class storing rows of table HostelService
   *  @param hostelId Database column hostel_id SqlType(int4)
   *  @param serviceId Database column service_id SqlType(int4) */
  case class HostelServiceRow(hostelId: Int, serviceId: Int)
  /** GetResult implicit for fetching HostelServiceRow objects using plain SQL queries */
  implicit def GetResultHostelServiceRow(implicit e0: GR[Int]): GR[HostelServiceRow] = GR{
    prs => import prs._
    HostelServiceRow.tupled((<<[Int], <<[Int]))
  }
  /** Table description of table hostel_service. Objects of this class serve as prototypes for rows in queries. */
  class HostelService(_tableTag: Tag) extends Table[HostelServiceRow](_tableTag, "hostel_service") {
    def * = (hostelId, serviceId) <> (HostelServiceRow.tupled, HostelServiceRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(hostelId), Rep.Some(serviceId)).shaped.<>({r=>import r._; _1.map(_=> HostelServiceRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column hostel_id SqlType(int4) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column service_id SqlType(int4) */
    val serviceId: Rep[Int] = column[Int]("service_id")

    /** Primary key of HostelService (database name hostel_service_pkey) */
    val pk = primaryKey("hostel_service_pkey", (hostelId, serviceId))

    /** Foreign key referencing Hostel (database name hostel_service_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_service_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Service (database name hostel_service_ibfk_2) */
    lazy val serviceFk = foreignKey("hostel_service_ibfk_2", serviceId, Service)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelService */
  lazy val HostelService = new TableQuery(tag => new HostelService(tag))

  /** Entity class storing rows of table Location
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param city Database column city SqlType(varchar), Length(100,true)
   *  @param country Database column country SqlType(varchar), Length(60,true)
   *  @param state Database column state SqlType(varchar), Length(60,true), Default(None)
   *  @param region Database column region SqlType(varchar), Length(60,true), Default(None)
   *  @param continent Database column continent SqlType(varchar), Length(60,true), Default(None) */
  case class LocationRow(id: Int, city: String, country: String, state: Option[String] = None, region: Option[String] = None, continent: Option[String] = None)
  /** GetResult implicit for fetching LocationRow objects using plain SQL queries */
  implicit def GetResultLocationRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[String]]): GR[LocationRow] = GR{
    prs => import prs._
    LocationRow.tupled((<<[Int], <<[String], <<[String], <<?[String], <<?[String], <<?[String]))
  }
  /** Table description of table location. Objects of this class serve as prototypes for rows in queries. */
  class Location(_tableTag: Tag) extends Table[LocationRow](_tableTag, "location") {
    def * = (id, city, country, state, region, continent) <> (LocationRow.tupled, LocationRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(city), Rep.Some(country), state, region, continent).shaped.<>({r=>import r._; _1.map(_=> LocationRow.tupled((_1.get, _2.get, _3.get, _4, _5, _6)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column city SqlType(varchar), Length(100,true) */
    val city: Rep[String] = column[String]("city", O.Length(100,varying=true))
    /** Database column country SqlType(varchar), Length(60,true) */
    val country: Rep[String] = column[String]("country", O.Length(60,varying=true))
    /** Database column state SqlType(varchar), Length(60,true), Default(None) */
    val state: Rep[Option[String]] = column[Option[String]]("state", O.Length(60,varying=true), O.Default(None))
    /** Database column region SqlType(varchar), Length(60,true), Default(None) */
    val region: Rep[Option[String]] = column[Option[String]]("region", O.Length(60,varying=true), O.Default(None))
    /** Database column continent SqlType(varchar), Length(60,true), Default(None) */
    val continent: Rep[Option[String]] = column[Option[String]]("continent", O.Length(60,varying=true), O.Default(None))
  }
  /** Collection-like TableQuery object for table Location */
  lazy val Location = new TableQuery(tag => new Location(tag))

  /** Entity class storing rows of table PlayEvolutions
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param hash Database column hash SqlType(varchar), Length(510,true)
   *  @param appliedAt Database column applied_at SqlType(timestamp)
   *  @param applyScript Database column apply_script SqlType(text), Default(None)
   *  @param revertScript Database column revert_script SqlType(text), Default(None)
   *  @param state Database column state SqlType(varchar), Length(510,true), Default(None)
   *  @param lastProblem Database column last_problem SqlType(text), Default(None) */
  case class PlayEvolutionsRow(id: Int, hash: String, appliedAt: java.sql.Timestamp, applyScript: Option[String] = None, revertScript: Option[String] = None, state: Option[String] = None, lastProblem: Option[String] = None)
  /** GetResult implicit for fetching PlayEvolutionsRow objects using plain SQL queries */
  implicit def GetResultPlayEvolutionsRow(implicit e0: GR[Int], e1: GR[String], e2: GR[java.sql.Timestamp], e3: GR[Option[String]]): GR[PlayEvolutionsRow] = GR{
    prs => import prs._
    PlayEvolutionsRow.tupled((<<[Int], <<[String], <<[java.sql.Timestamp], <<?[String], <<?[String], <<?[String], <<?[String]))
  }
  /** Table description of table play_evolutions. Objects of this class serve as prototypes for rows in queries. */
  class PlayEvolutions(_tableTag: Tag) extends Table[PlayEvolutionsRow](_tableTag, "play_evolutions") {
    def * = (id, hash, appliedAt, applyScript, revertScript, state, lastProblem) <> (PlayEvolutionsRow.tupled, PlayEvolutionsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(hash), Rep.Some(appliedAt), applyScript, revertScript, state, lastProblem).shaped.<>({r=>import r._; _1.map(_=> PlayEvolutionsRow.tupled((_1.get, _2.get, _3.get, _4, _5, _6, _7)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column hash SqlType(varchar), Length(510,true) */
    val hash: Rep[String] = column[String]("hash", O.Length(510,varying=true))
    /** Database column applied_at SqlType(timestamp) */
    val appliedAt: Rep[java.sql.Timestamp] = column[java.sql.Timestamp]("applied_at")
    /** Database column apply_script SqlType(text), Default(None) */
    val applyScript: Rep[Option[String]] = column[Option[String]]("apply_script", O.Default(None))
    /** Database column revert_script SqlType(text), Default(None) */
    val revertScript: Rep[Option[String]] = column[Option[String]]("revert_script", O.Default(None))
    /** Database column state SqlType(varchar), Length(510,true), Default(None) */
    val state: Rep[Option[String]] = column[Option[String]]("state", O.Length(510,varying=true), O.Default(None))
    /** Database column last_problem SqlType(text), Default(None) */
    val lastProblem: Rep[Option[String]] = column[Option[String]]("last_problem", O.Default(None))
  }
  /** Collection-like TableQuery object for table PlayEvolutions */
  lazy val PlayEvolutions = new TableQuery(tag => new PlayEvolutions(tag))

  /** Entity class storing rows of table Review
   *  @param id Database column id SqlType(serial), AutoInc
   *  @param hostelId Database column hostel_id SqlType(int4)
   *  @param text Database column text SqlType(text)
   *  @param year Database column year SqlType(date), Default(None)
   *  @param reviewer Database column reviewer SqlType(varchar), Length(200,true), Default(None)
   *  @param city Database column city SqlType(varchar), Length(200,true), Default(None)
   *  @param gender Database column gender SqlType(varchar), Length(100,true), Default(None)
   *  @param age Database column age SqlType(int4), Default(None) */
  case class ReviewRow(id: Int, hostelId: Int, text: String, year: Option[java.sql.Date] = None, reviewer: Option[String] = None, city: Option[String] = None, gender: Option[String] = None, age: Option[Int] = None)
  /** GetResult implicit for fetching ReviewRow objects using plain SQL queries */
  implicit def GetResultReviewRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[java.sql.Date]], e3: GR[Option[String]], e4: GR[Option[Int]]): GR[ReviewRow] = GR{
    prs => import prs._
    ReviewRow.tupled((<<[Int], <<[Int], <<[String], <<?[java.sql.Date], <<?[String], <<?[String], <<?[String], <<?[Int]))
  }
  /** Table description of table review. Objects of this class serve as prototypes for rows in queries. */
  class Review(_tableTag: Tag) extends Table[ReviewRow](_tableTag, "review") {
    def * = (id, hostelId, text, year, reviewer, city, gender, age) <> (ReviewRow.tupled, ReviewRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(hostelId), Rep.Some(text), year, reviewer, city, gender, age).shaped.<>({r=>import r._; _1.map(_=> ReviewRow.tupled((_1.get, _2.get, _3.get, _4, _5, _6, _7, _8)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc */
    val id: Rep[Int] = column[Int]("id", O.AutoInc)
    /** Database column hostel_id SqlType(int4) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column text SqlType(text) */
    val text: Rep[String] = column[String]("text")
    /** Database column year SqlType(date), Default(None) */
    val year: Rep[Option[java.sql.Date]] = column[Option[java.sql.Date]]("year", O.Default(None))
    /** Database column reviewer SqlType(varchar), Length(200,true), Default(None) */
    val reviewer: Rep[Option[String]] = column[Option[String]]("reviewer", O.Length(200,varying=true), O.Default(None))
    /** Database column city SqlType(varchar), Length(200,true), Default(None) */
    val city: Rep[Option[String]] = column[Option[String]]("city", O.Length(200,varying=true), O.Default(None))
    /** Database column gender SqlType(varchar), Length(100,true), Default(None) */
    val gender: Rep[Option[String]] = column[Option[String]]("gender", O.Length(100,varying=true), O.Default(None))
    /** Database column age SqlType(int4), Default(None) */
    val age: Rep[Option[Int]] = column[Option[Int]]("age", O.Default(None))
  }
  /** Collection-like TableQuery object for table Review */
  lazy val Review = new TableQuery(tag => new Review(tag))

  /** Entity class storing rows of table Search
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param sess Database column sess SqlType(varchar), Length(80,true)
   *  @param cityId Database column city_id SqlType(int4)
   *  @param hostelId Database column hostel_id SqlType(int4), Default(None)
   *  @param timestamp Database column timestamp SqlType(int8)
   *  @param adwords Database column adwords SqlType(bool) */
  case class SearchRow(id: Int, sess: String, cityId: Int, hostelId: Option[Int] = None, timestamp: Long, adwords: Boolean)
  /** GetResult implicit for fetching SearchRow objects using plain SQL queries */
  implicit def GetResultSearchRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[Int]], e3: GR[Long], e4: GR[Boolean]): GR[SearchRow] = GR{
    prs => import prs._
    SearchRow.tupled((<<[Int], <<[String], <<[Int], <<?[Int], <<[Long], <<[Boolean]))
  }
  /** Table description of table search. Objects of this class serve as prototypes for rows in queries. */
  class Search(_tableTag: Tag) extends Table[SearchRow](_tableTag, "search") {
    def * = (id, sess, cityId, hostelId, timestamp, adwords) <> (SearchRow.tupled, SearchRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(sess), Rep.Some(cityId), hostelId, Rep.Some(timestamp), Rep.Some(adwords)).shaped.<>({r=>import r._; _1.map(_=> SearchRow.tupled((_1.get, _2.get, _3.get, _4, _5.get, _6.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column sess SqlType(varchar), Length(80,true) */
    val sess: Rep[String] = column[String]("sess", O.Length(80,varying=true))
    /** Database column city_id SqlType(int4) */
    val cityId: Rep[Int] = column[Int]("city_id")
    /** Database column hostel_id SqlType(int4), Default(None) */
    val hostelId: Rep[Option[Int]] = column[Option[Int]]("hostel_id", O.Default(None))
    /** Database column timestamp SqlType(int8) */
    val timestamp: Rep[Long] = column[Long]("timestamp")
    /** Database column adwords SqlType(bool) */
    val adwords: Rep[Boolean] = column[Boolean]("adwords")

    /** Foreign key referencing Hostel (database name search_ibfk_2) */
    lazy val hostelFk = foreignKey("search_ibfk_2", hostelId, Hostel)(r => Rep.Some(r.id), onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Location (database name search_ibfk_1) */
    lazy val locationFk = foreignKey("search_ibfk_1", cityId, Location)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table Search */
  lazy val Search = new TableQuery(tag => new Search(tag))

  /** Entity class storing rows of table Service
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(varchar), Length(100,true) */
  case class ServiceRow(id: Int, name: String)
  /** GetResult implicit for fetching ServiceRow objects using plain SQL queries */
  implicit def GetResultServiceRow(implicit e0: GR[Int], e1: GR[String]): GR[ServiceRow] = GR{
    prs => import prs._
    ServiceRow.tupled((<<[Int], <<[String]))
  }
  /** Table description of table service. Objects of this class serve as prototypes for rows in queries. */
  class Service(_tableTag: Tag) extends Table[ServiceRow](_tableTag, "service") {
    def * = (id, name) <> (ServiceRow.tupled, ServiceRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(name)).shaped.<>({r=>import r._; _1.map(_=> ServiceRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(varchar), Length(100,true) */
    val name: Rep[String] = column[String]("name", O.Length(100,varying=true))
  }
  /** Collection-like TableQuery object for table Service */
  lazy val Service = new TableQuery(tag => new Service(tag))

  /** Entity class storing rows of table Share
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param sessionId Database column session_id SqlType(int4) */
  case class ShareRow(id: Int, sessionId: Int)
  /** GetResult implicit for fetching ShareRow objects using plain SQL queries */
  implicit def GetResultShareRow(implicit e0: GR[Int]): GR[ShareRow] = GR{
    prs => import prs._
    ShareRow.tupled((<<[Int], <<[Int]))
  }
  /** Table description of table share. Objects of this class serve as prototypes for rows in queries. */
  class Share(_tableTag: Tag) extends Table[ShareRow](_tableTag, "share") {
    def * = (id, sessionId) <> (ShareRow.tupled, ShareRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(sessionId)).shaped.<>({r=>import r._; _1.map(_=> ShareRow.tupled((_1.get, _2.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column session_id SqlType(int4) */
    val sessionId: Rep[Int] = column[Int]("session_id")
  }
  /** Collection-like TableQuery object for table Share */
  lazy val Share = new TableQuery(tag => new Share(tag))
}
