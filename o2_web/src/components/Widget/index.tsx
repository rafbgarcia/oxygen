import React from "react"
import { WidgetType } from "../../lib/codegenGraphql"
import { Pivot } from "./Pivot"
import { VerticalBarChart } from "./VerticalBarChart"

const WIDGETS: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: Pivot,
  [WidgetType.VerticalBarChart]: VerticalBarChart,
}

export const Widget = ({ type, renderData }) => {
  if (!renderData) {
    return null
  }

  return React.createElement(WIDGETS[type], { meta: renderData })
}
