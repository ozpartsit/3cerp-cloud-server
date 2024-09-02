
import currency from "./currencies"
import language from "./languages"
import country from "./countries"
import operator from "./operators"
import template from "./templates"
import trigger from "./triggers.js"
import intervals from "./intervals"
import dataranges from "./dataranges"

import chartfields from "./chartfields.js"
import chartvalues from "./chartvalues.js"
import chartsources from "./chartsources.js"

export default {
    country: country,
    frequency: ["firstDayOfMonth", "lastDayOfMonth"],
    currency: currency,
    language: language,
    trantypes: ["SalesOrder", "Invoice"],
    operator: operator,
    template: template,
    trigger: trigger,
    interval: intervals,
    datarange: dataranges,

    chartfield: chartfields,
    chartvalue: chartvalues,
    chartsource: chartsources,

} as any