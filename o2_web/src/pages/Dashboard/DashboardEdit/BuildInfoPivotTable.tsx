import {
  BuildInfoWithDatasetFields,
  BuildInfoWithDatasetFieldsProps,
  dataType,
} from "./_BuildInfoWithDatasetFields"
import type { BuildInfoSections } from "./_BuildInfoWithDatasetFields"

const sections: BuildInfoSections = [
  { renderDataKey: "rows", label: "Rows", dataType: dataType.DIMENSION },
  { renderDataKey: "values", label: "Values", dataType: dataType.MEASURE },
  { renderDataKey: "columns", label: "Columns", dataType: dataType.DIMENSION },
]

export const BuildInfoPivotTable = (props: Omit<BuildInfoWithDatasetFieldsProps, "sections">) => {
  return <BuildInfoWithDatasetFields sections={sections} {...props} />
}
