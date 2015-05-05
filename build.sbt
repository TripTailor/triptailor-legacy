name         := """triptailor"""
version      := "1.0-SNAPSHOT"
scalaVersion := "2.11.6"

val dbDependencies = Seq(
  "mysql" % "mysql-connector-java" % "5.1.35",
  "com.typesafe.play" %% "play-slick" % "1.0.0-RC3",
  "com.typesafe.slick" %% "slick-codegen" % "3.0.0",
  "com.zaxxer" % "HikariCP" % "2.3.5" % Compile
)

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
) ++ dbDependencies ++ testDependencies

initialCommands in console := consoleCommands

routesGenerator := InjectedRoutesGenerator

lazy val root = (project in file(".")).enablePlugins(PlayScala)
