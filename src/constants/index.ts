
import currency from "./currencies"
import language from "./languages"
import country from "./countries"
import operator from "./operators"
export default {
    country: country,
    frequency: ["firstDayOfMonth", "lastDayOfMonth"],
    currency: currency,
    language: language,
    trantypes: ["SalesOrder", "Invoice"],
    operator: operator,
} as any