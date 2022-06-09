import { WidgetType } from "../../lib/codegenGraphql"
import { reduce } from "lodash-es"

export const initialBuildInfo: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: {
    rows: [],
    values: [],
    columns: [],
    rowTotals: false,
    columnTotals: false,
  },
  [WidgetType.VerticalBarChart]: {
    rows: [],
    values: [],
    columns: [],
  },
  [WidgetType.Text]: {
    isTitle: true,
    text: "Type something...",
  },
}

export const template = (template, values) => {
  return reduce(values, (acc, value, placeholder) => acc.replaceAll(`:${placeholder}`, value), template)
}
