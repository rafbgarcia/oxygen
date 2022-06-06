import React from "react"
import { WidgetType } from "../../lib/codegenGraphql"
import { Pivot } from "./Pivot"
import { Text } from "./Text"
import { VerticalBarChart } from "./VerticalBarChart"
import { isEmpty } from "lodash-es"

const WIDGETS: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: Pivot,
  [WidgetType.VerticalBarChart]: VerticalBarChart,
  [WidgetType.Text]: Text,
}

export const Widget = ({ type, renderData }) => {
  if (isEmpty(renderData)) {
    return null
  }

  return React.createElement(WIDGETS[type], { meta: renderData })
}
