import type { Widget, WidgetType } from "../../../lib/codegenGraphql"
import { dataType } from "./_BuildInfoWithDatasetFields"

export const initialBuildInfo: Record<WidgetType, any> = {
  PIVOT_TABLE: {
    sections: [
      { renderDataKey: "rows", label: "Rows", dataType: dataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
      { renderDataKey: "columns", label: "Columns", dataType: dataType.DIMENSION },
    ],
    rows: [],
    values: [],
    columns: [],
  },
  VERTICAL_BAR_CHART: {
    sections: [
      { renderDataKey: "rows", label: "Categories", dataType: dataType.DIMENSION },
      { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
      { renderDataKey: "columns", label: "Break by", dataType: dataType.DIMENSION },
    ],
    rows: [],
    values: [],
    columns: [],
  },
}
