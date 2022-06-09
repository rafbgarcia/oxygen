import React from "react"
import { DashboardQuery, WidgetType } from "../../lib/codegenGraphql"
import { Pivot } from "./Pivot"
import { Text } from "./Text"
import { VerticalBarChart } from "./VerticalBarChart"

const WIDGETS: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: Pivot,
  [WidgetType.VerticalBarChart]: VerticalBarChart,
  [WidgetType.Text]: Text,
}

export const Widget = ({
  widget,
  dataset,
}: {
  widget: DashboardQuery["dashboard"]["widgets"][0]
  dataset: DashboardQuery["dashboard"]["dataset"]
}) => {
  return React.createElement(WIDGETS[widget.type], { widget, dataset })
}
