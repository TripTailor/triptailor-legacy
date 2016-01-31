import scala.concurrent.{ExecutionContext, Future}

package object extensions {

  case class FutureO[+A](future: Future[Option[A]]) extends AnyVal {
    def flatMap[B](f: A => FutureO[B])(implicit ec: ExecutionContext): FutureO[B] = {
      val newFuture = future.flatMap {
        case Some(a) => f(a).future
        case None    => Future.successful(None)
      }
      FutureO(newFuture)
    }

    def filter(p: A => Boolean)(implicit ec: ExecutionContext): FutureO[A] =
      FutureO(future.map(option => option filter p))

    def withFilter(p: A => Boolean)(implicit ec: ExecutionContext): FutureO[A] =
      filter(p)

    def map[B](f: A => B)(implicit ec: ExecutionContext): FutureO[B] =
      FutureO(future.map(option => option map f))
  }

}
