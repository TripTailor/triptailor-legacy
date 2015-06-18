name         := """triptailor"""
version      := "1.0-SNAPSHOT"
scalaVersion := "2.11.6"

val dbDependencies = Seq(
  "mysql" % "mysql-connector-java" % "5.1.35",
  "com.typesafe.play" %% "play-slick" % "1.0.0",
  "com.typesafe.slick" %% "slick-codegen" % "3.0.0",
  "com.zaxxer" % "HikariCP" % "2.3.5" % Compile
)

/** Frontend assets **/
val jsWebJars = Seq(
  "org.webjars" %% "webjars-play" % "2.4.0-1",
  "org.webjars" % "jquery" % "2.1.4",
  "org.webjars" % "react" % "0.13.3"
)

val cssWebJars = Seq(
  "org.webjars" % "font-awesome" % "4.3.0-2",
  "org.webjars" % "bootstrap" % "3.3.5",
  "org.webjars" % "font-awesome" % "4.3.0-2"
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
    | import play.api.{ Play, DefaultApplication, Mode }
  """.stripMargin

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws
) ++ dbDependencies ++ webJarAssetDependencies ++ testDependencies

initialCommands in console := consoleCommands

sources in (Compile, doc)  := Seq.empty

routesGenerator := InjectedRoutesGenerator

lazy val root = (project in file(".")).enablePlugins(PlayScala)
