package db
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = slick.driver.MySQLDriver
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.driver.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema = Array(Attribute.schema, AttributeSearch.schema, Hostel.schema, HostelAttribute.schema, HostelSearch.schema, HostelService.schema, Location.schema, Search.schema, Service.schema).reduceLeft(_ ++ _)
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table Attribute
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(VARCHAR), Length(50,true) */
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

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(VARCHAR), Length(50,true) */
    val name: Rep[String] = column[String]("name", O.Length(50,varying=true))
  }
  /** Collection-like TableQuery object for table Attribute */
  lazy val Attribute = new TableQuery(tag => new Attribute(tag))

  /** Entity class storing rows of table AttributeSearch
   *  @param attributeId Database column attribute_id SqlType(INT)
   *  @param searchId Database column search_id SqlType(INT) */
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

    /** Database column attribute_id SqlType(INT) */
    val attributeId: Rep[Int] = column[Int]("attribute_id")
    /** Database column search_id SqlType(INT) */
    val searchId: Rep[Int] = column[Int]("search_id")

    /** Primary key of AttributeSearch (database name attribute_search_PK) */
    val pk = primaryKey("attribute_search_PK", (attributeId, searchId))

    /** Foreign key referencing Attribute (database name attribute_search_ibfk_1) */
    lazy val attributeFk = foreignKey("attribute_search_ibfk_1", attributeId, Attribute)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Search (database name attribute_search_ibfk_2) */
    lazy val searchFk = foreignKey("attribute_search_ibfk_2", searchId, Search)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table AttributeSearch */
  lazy val AttributeSearch = new TableQuery(tag => new AttributeSearch(tag))

  /** Entity class storing rows of table Hostel
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(VARCHAR), Length(100,true)
   *  @param description Database column description SqlType(TEXT), Default(None)
   *  @param price Database column price SqlType(FLOAT), Default(None)
   *  @param image Database column image SqlType(VARCHAR), Length(50,true), Default(None)
   *  @param url Database column url SqlType(VARCHAR), Length(200,true), Default(None)
   *  @param noReviews Database column no_reviews SqlType(INT)
   *  @param locationId Database column location_id SqlType(INT) */
  case class HostelRow(id: Int, name: String, description: Option[String] = None, price: Option[Float] = None, image: Option[String] = None, url: Option[String] = None, noReviews: Int, locationId: Int)
  /** GetResult implicit for fetching HostelRow objects using plain SQL queries */
  implicit def GetResultHostelRow(implicit e0: GR[Int], e1: GR[String], e2: GR[Option[String]], e3: GR[Option[Float]]): GR[HostelRow] = GR{
    prs => import prs._
    HostelRow.tupled((<<[Int], <<[String], <<?[String], <<?[Float], <<?[String], <<?[String], <<[Int], <<[Int]))
  }
  /** Table description of table hostel. Objects of this class serve as prototypes for rows in queries. */
  class Hostel(_tableTag: Tag) extends Table[HostelRow](_tableTag, "hostel") {
    def * = (id, name, description, price, image, url, noReviews, locationId) <> (HostelRow.tupled, HostelRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(id), Rep.Some(name), description, price, image, url, Rep.Some(noReviews), Rep.Some(locationId)).shaped.<>({r=>import r._; _1.map(_=> HostelRow.tupled((_1.get, _2.get, _3, _4, _5, _6, _7.get, _8.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(VARCHAR), Length(100,true) */
    val name: Rep[String] = column[String]("name", O.Length(100,varying=true))
    /** Database column description SqlType(TEXT), Default(None) */
    val description: Rep[Option[String]] = column[Option[String]]("description", O.Default(None))
    /** Database column price SqlType(FLOAT), Default(None) */
    val price: Rep[Option[Float]] = column[Option[Float]]("price", O.Default(None))
    /** Database column image SqlType(VARCHAR), Length(50,true), Default(None) */
    val image: Rep[Option[String]] = column[Option[String]]("image", O.Length(50,varying=true), O.Default(None))
    /** Database column url SqlType(VARCHAR), Length(200,true), Default(None) */
    val url: Rep[Option[String]] = column[Option[String]]("url", O.Length(200,varying=true), O.Default(None))
    /** Database column no_reviews SqlType(INT) */
    val noReviews: Rep[Int] = column[Int]("no_reviews")
    /** Database column location_id SqlType(INT) */
    val locationId: Rep[Int] = column[Int]("location_id")

    /** Foreign key referencing Location (database name hostel_ibfk_1) */
    lazy val locationFk = foreignKey("hostel_ibfk_1", locationId, Location)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table Hostel */
  lazy val Hostel = new TableQuery(tag => new Hostel(tag))

  /** Entity class storing rows of table HostelAttribute
   *  @param hostelId Database column hostel_id SqlType(INT)
   *  @param attributeId Database column attribute_id SqlType(INT)
   *  @param freq Database column freq SqlType(DOUBLE)
   *  @param cfreq Database column cfreq SqlType(DOUBLE)
   *  @param rating Database column rating SqlType(DOUBLE) */
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

    /** Database column hostel_id SqlType(INT) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column attribute_id SqlType(INT) */
    val attributeId: Rep[Int] = column[Int]("attribute_id")
    /** Database column freq SqlType(DOUBLE) */
    val freq: Rep[Double] = column[Double]("freq")
    /** Database column cfreq SqlType(DOUBLE) */
    val cfreq: Rep[Double] = column[Double]("cfreq")
    /** Database column rating SqlType(DOUBLE) */
    val rating: Rep[Double] = column[Double]("rating")

    /** Primary key of HostelAttribute (database name hostel_attribute_PK) */
    val pk = primaryKey("hostel_attribute_PK", (hostelId, attributeId))

    /** Foreign key referencing Attribute (database name hostel_attribute_ibfk_2) */
    lazy val attributeFk = foreignKey("hostel_attribute_ibfk_2", attributeId, Attribute)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Hostel (database name hostel_attribute_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_attribute_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelAttribute */
  lazy val HostelAttribute = new TableQuery(tag => new HostelAttribute(tag))

  /** Entity class storing rows of table HostelSearch
   *  @param hostelId Database column hostel_id SqlType(INT)
   *  @param searchId Database column search_id SqlType(INT)
   *  @param timestamp Database column timestamp SqlType(BIGINT) */
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

    /** Database column hostel_id SqlType(INT) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column search_id SqlType(INT) */
    val searchId: Rep[Int] = column[Int]("search_id")
    /** Database column timestamp SqlType(BIGINT) */
    val timestamp: Rep[Long] = column[Long]("timestamp")

    /** Primary key of HostelSearch (database name hostel_search_PK) */
    val pk = primaryKey("hostel_search_PK", (hostelId, searchId))

    /** Foreign key referencing Hostel (database name hostel_search_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_search_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Search (database name hostel_search_ibfk_2) */
    lazy val searchFk = foreignKey("hostel_search_ibfk_2", searchId, Search)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelSearch */
  lazy val HostelSearch = new TableQuery(tag => new HostelSearch(tag))

  /** Entity class storing rows of table HostelService
   *  @param hostelId Database column hostel_id SqlType(INT)
   *  @param serviceId Database column service_id SqlType(INT) */
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

    /** Database column hostel_id SqlType(INT) */
    val hostelId: Rep[Int] = column[Int]("hostel_id")
    /** Database column service_id SqlType(INT) */
    val serviceId: Rep[Int] = column[Int]("service_id")

    /** Primary key of HostelService (database name hostel_service_PK) */
    val pk = primaryKey("hostel_service_PK", (hostelId, serviceId))

    /** Foreign key referencing Hostel (database name hostel_service_ibfk_1) */
    lazy val hostelFk = foreignKey("hostel_service_ibfk_1", hostelId, Hostel)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Service (database name hostel_service_ibfk_2) */
    lazy val serviceFk = foreignKey("hostel_service_ibfk_2", serviceId, Service)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table HostelService */
  lazy val HostelService = new TableQuery(tag => new HostelService(tag))

  /** Entity class storing rows of table Location
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param city Database column city SqlType(VARCHAR), Length(50,true)
   *  @param country Database column country SqlType(VARCHAR), Length(30,true)
   *  @param state Database column state SqlType(VARCHAR), Length(30,true), Default(None)
   *  @param region Database column region SqlType(VARCHAR), Length(30,true), Default(None)
   *  @param continent Database column continent SqlType(VARCHAR), Length(30,true), Default(None) */
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

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column city SqlType(VARCHAR), Length(50,true) */
    val city: Rep[String] = column[String]("city", O.Length(50,varying=true))
    /** Database column country SqlType(VARCHAR), Length(30,true) */
    val country: Rep[String] = column[String]("country", O.Length(30,varying=true))
    /** Database column state SqlType(VARCHAR), Length(30,true), Default(None) */
    val state: Rep[Option[String]] = column[Option[String]]("state", O.Length(30,varying=true), O.Default(None))
    /** Database column region SqlType(VARCHAR), Length(30,true), Default(None) */
    val region: Rep[Option[String]] = column[Option[String]]("region", O.Length(30,varying=true), O.Default(None))
    /** Database column continent SqlType(VARCHAR), Length(30,true), Default(None) */
    val continent: Rep[Option[String]] = column[Option[String]]("continent", O.Length(30,varying=true), O.Default(None))

    /** Uniqueness Index over (city,country) (database name city_country) */
    val index1 = index("city_country", (city, country), unique=true)
  }
  /** Collection-like TableQuery object for table Location */
  lazy val Location = new TableQuery(tag => new Location(tag))

  /** Entity class storing rows of table Search
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param sess Database column sess SqlType(VARCHAR), Length(40,true)
   *  @param cityId Database column city_id SqlType(INT)
   *  @param hostelId Database column hostel_id SqlType(INT), Default(None)
   *  @param timestamp Database column timestamp SqlType(BIGINT)
   *  @param adwords Database column adwords SqlType(BIT) */
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

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column sess SqlType(VARCHAR), Length(40,true) */
    val sess: Rep[String] = column[String]("sess", O.Length(40,varying=true))
    /** Database column city_id SqlType(INT) */
    val cityId: Rep[Int] = column[Int]("city_id")
    /** Database column hostel_id SqlType(INT), Default(None) */
    val hostelId: Rep[Option[Int]] = column[Option[Int]]("hostel_id", O.Default(None))
    /** Database column timestamp SqlType(BIGINT) */
    val timestamp: Rep[Long] = column[Long]("timestamp")
    /** Database column adwords SqlType(BIT) */
    val adwords: Rep[Boolean] = column[Boolean]("adwords")

    /** Foreign key referencing Hostel (database name search_ibfk_2) */
    lazy val hostelFk = foreignKey("search_ibfk_2", hostelId, Hostel)(r => Rep.Some(r.id), onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
    /** Foreign key referencing Location (database name search_ibfk_1) */
    lazy val locationFk = foreignKey("search_ibfk_1", cityId, Location)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.NoAction)
  }
  /** Collection-like TableQuery object for table Search */
  lazy val Search = new TableQuery(tag => new Search(tag))

  /** Entity class storing rows of table Service
   *  @param id Database column id SqlType(INT), AutoInc, PrimaryKey
   *  @param name Database column name SqlType(VARCHAR), Length(50,true) */
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

    /** Database column id SqlType(INT), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column name SqlType(VARCHAR), Length(50,true) */
    val name: Rep[String] = column[String]("name", O.Length(50,varying=true))
  }
  /** Collection-like TableQuery object for table Service */
  lazy val Service = new TableQuery(tag => new Service(tag))
}
