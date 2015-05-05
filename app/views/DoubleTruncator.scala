package views

object DoubleTruncator {
  def truncate(n: Double, m: Double): Double = math.round(n * math.pow(10, m)) / math.pow(10, m)
}