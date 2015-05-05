package views

import scala.math.BigDecimal.RoundingMode

object PriceFormatter {

  def format(price: BigDecimal, decimals: Int = 2, currency: String = "USD") =
    "$ %s %s".format(price.setScale(decimals, RoundingMode.HALF_EVEN).toString(), currency)

}
