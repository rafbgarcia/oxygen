import React from "react"
import type { WidgetType } from "../../lib/codegenGraphql"
import { Pivot } from "./Pivot"
import { VerticalBarChart } from "./VerticalBarChart"

type PreviewMapping = Record<WidgetType, any>
type Props = Widget & { type: WidgetType }

const WIDGETS: PreviewMapping = {
  PIVOT_TABLE: Pivot,
  VERTICAL_BAR_CHART: VerticalBarChart,
}

export const Widget = ({ type, renderData, theme }) => {
  if (!renderData) {
    return null
  }

  return React.createElement(WIDGETS[type], { meta: renderData, theme })
}
