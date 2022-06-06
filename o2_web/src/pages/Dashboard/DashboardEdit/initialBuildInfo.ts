import { WidgetType } from "../../../lib/codegenGraphql"
import { dataType } from "./BuildInfoWithDatasetFields"

export const initialBuildInfo: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: {
    sections: [
      { renderDataKey: "rows", label: "Rows", dataType: dataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
      { renderDataKey: "columns", label: "Columns", dataType: dataType.DIMENSION },
    ],
    rows: [],
    values: [],
    columns: [],
  },
  [WidgetType.VerticalBarChart]: {
    sections: [
      { renderDataKey: "rows", label: "Categories", dataType: dataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
      { renderDataKey: "columns", label: "Break by", dataType: dataType.DIMENSION },
    ],
    rows: [],
    values: [],
    columns: [],
  },
  [WidgetType.Text]: {
    isTitle: true,
    text: "Type something...",
  },
}
