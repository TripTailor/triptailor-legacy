name         := """triptailor"""
version      := "1.0-SNAPSHOT"
scalaVersion := "2.11.7"

val scraperDepencncies = Seq(
  "org.jsoup" % "jsoup" % "1.8.3"
)

val dbDependencies = Seq(
  "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
  "com.typesafe.play" %% "play-slick" % "1.1.0",
  "com.typesafe.slick" %% "slick-codegen" % "3.1.0",
  "com.zaxxer" % "HikariCP" % "2.3.5" % Compile
)

/** Frontend assets **/
val jsWebJars = Seq(
  "org.webjars" %% "webjars-play" % "2.4.0-1",
  "org.webjars" % "jquery" % "2.1.4",
  "org.webjars" % "jquery-ui" % "1.11.4",
  "org.webjars" % "react" % "0.13.3"
)

val cssWebJars = Seq(
  "org.webjars" % "font-awesome" % "4.3.0-2",
  "org.webjars" % "bootstrap" % "3.3.5"
)
/****/

val webJarAssetDependencies = cssWebJars ++ jsWebJars

val testDependencies = Seq(
  "org.scalatestplus" %% "play" % "1.2.0" % "test",
  "org.mockito" % "mockito-all" % "1.9.0" % "test"
)

val consoleCommands =
  """
    | import scala.concurrent.duration.DurationInt
    | import scala.concurrent.{ Await, Future }
    | import play.api.libs.concurrent.Execution.defaultContext
    | import play.api.libs.json._
    | import play.api.{ Environment, ApplicationLoader, Play, Mode }
    | val env = Environment(new java.io.File("."), this.getClass.getClassLoader, Mode.Dev)
    | val context = ApplicationLoader.createContext(env)
    | val loader = ApplicationLoader(context)
    | val app = loader.load(context)
    | Play.start(app)
    | import Play.current
  """.stripMargin

/** Docker settings **/
maintainer in Docker := "Samuel Heaney <sheaney@gmail.com>"
dockerRepository     :=  Some("sheaney")
dockerBaseImage      :=  "anapsix/docker-oracle-java8"
dockerExposedPorts   :=  Seq(9000)
dockerEntrypoint     :=  Seq(s"bin/${executableScriptName.value}", "-J-Xmx384m", "-J-server")
/***/

libraryDependencies ++= Seq(
  cache,
  ws
) ++ scraperDepencncies ++ dbDependencies ++ webJarAssetDependencies ++ testDependencies

initialCommands in console := consoleCommands

sources in (Compile, doc)  := Seq.empty

routesGenerator := InjectedRoutesGenerator

lazy val root = (project in file(".")).enablePlugins(PlayScala)
