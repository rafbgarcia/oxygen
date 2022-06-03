import { BuildInfoWithDatasetFields, dataType } from "./_BuildInfoWithDatasetFields"
import type { BuildInfoSections } from "./_BuildInfoWithDatasetFields"

const sections: BuildInfoSections = [
  { renderDataKey: "rows", label: "Rows", dataType: dataType.DIMENSION },
  { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
  { renderDataKey: "columns", label: "Columns", dataType: dataType.DIMENSION },
]

type Props = {
  onChange: any
  dashboard: any
}

export const BuildInfoPivotTable = (props: Props) => {
  return <BuildInfoWithDatasetFields sections={sections} {...props} />
}
