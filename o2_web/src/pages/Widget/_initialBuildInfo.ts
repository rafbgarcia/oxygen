import { WidgetType } from "../../lib/codegenGraphql"
import { DataType } from "./BuildInfoWithDatasetFields"

export const initialBuildInfo: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: {
    sections: [
      { renderDataKey: "rows", label: "Rows", dataType: DataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: DataType.MEASURE },
      { renderDataKey: "columns", label: "Columns", dataType: DataType.DIMENSION },
    ],
    rows: [],
    values: [],
    columns: [],
  },
  [WidgetType.VerticalBarChart]: {
    sections: [
      { renderDataKey: "rows", label: "Categories", dataType: DataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: DataType.MEASURE },
      { renderDataKey: "columns", label: "Break by", dataType: DataType.DIMENSION },
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
