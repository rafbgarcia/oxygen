import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Button } from "../../../components/Button"
import { Popover } from "../../../components/Popover"
import { DashboardQuery, DatasetTableColumnType } from "../../../lib/codegenGraphql"
import produce from "immer"
import { Chip } from "../../../components/Chip"

type BuildInfoSectionType = { renderDataKey: string; label: string; dataType: dataType }
export type BuildInfoSections = Array<BuildInfoSectionType>
export type BuildInfoWithDatasetFieldsProps = {
  dataset: DashboardQuery["dashboard"]["dataset"]
  buildInfo: any
  onChange: any
}
export enum dataType {
  MEASURE = "Measure",
  DIMENSION = "Dimension",
}

const AGGREGATIONS = ["COUNT", "COUNT DISTINCT", "SUM"]
const FUNCTIONS = ["CONTRIBUTION"]

export const BuildInfoWithDatasetFields = ({
  dataset,
  buildInfo,
  onChange,
}: BuildInfoWithDatasetFieldsProps) => {
  return (
    <>
      {buildInfo.sections.map((section) => (
        <BuildInfoSection
          key={section.renderDataKey}
          section={section}
          buildInfo={buildInfo}
          dataset={dataset}
          onChange={onChange}
        />
      ))}
    </>
  )
}

const BuildInfoSection = ({
  buildInfo,
  section,
  dataset,
  onChange,
}: {
  buildInfo: any
  section: BuildInfoSectionType
  dataset: DashboardQuery["dashboard"]["dataset"]
  onChange: any
}) => {
  const didAddField = (table, column) => () => {
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      const item = { tableId: table.id, columnId: column.id, alias: column.name, agg: `COUNT` }
      draft[section.renderDataKey].push(item)
    })
    onChange(updatedBuildInfo)
  }
  const didRemoveField = (index) => () => {
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      draft[section.renderDataKey].splice(index, 1)
    })
    onChange(updatedBuildInfo)
  }

  return (
    <div className="mb-10">
      <div className="mb-5">
        <header className="flex items-center justify-between">
          <span className="font-medium">{section.label}</span>

          <Popover
            position="bottom-left"
            Button={
              <Button className="flex items-center" $iconXs>
                <PlusSmIcon className="w-4 h-4" />
              </Button>
            }
          >
            <div className="flex flex-col gap-y-8 max-h-96 overflow-y-auto min-w-fit">
              {dataset.tables.map((table) => (
                <TableColumns
                  key={table.id}
                  dataType={section.dataType}
                  table={table}
                  didAddField={didAddField}
                />
              ))}
            </div>
          </Popover>
        </header>

        {buildInfo[section.renderDataKey].map((item, index) => (
          <BuildItem key={item.alias} item={item} onRemove={didRemoveField(index)} />
        ))}
      </div>
    </div>
  )
}

const BuildItem = ({ item, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-2 my-2">
      {item.alias}
      <a className="cursor-pointer" onClick={onRemove}>
        <TrashIcon className="w-4 h-4" />
      </a>
    </div>
  )
}

const FIELD_TYPE_DEFAULT_ACTION = {
  [dataType.MEASURE]: {
    [DatasetTableColumnType.Text]: "Count Unique",
    [DatasetTableColumnType.Integer]: "Sum",
    [DatasetTableColumnType.Float]: "Sum",
    [DatasetTableColumnType.Datetime]: "# of years",
  },
  [dataType.DIMENSION]: {
    [DatasetTableColumnType.Text]: "All Items",
    [DatasetTableColumnType.Integer]: "All Items",
    [DatasetTableColumnType.Float]: "All Items",
    [DatasetTableColumnType.Datetime]: "All Items",
  },
}
type TableColumnsProps = {
  table: DashboardQuery["dashboard"]["dataset"]["tables"][0]
  dataType: dataType
  didAddField: any
}
const TableColumns = ({ table, dataType, didAddField }: TableColumnsProps) => {
  return (
    <ul className="">
      {table.columns.map((column) => (
        <Popover.Button
          as="li"
          key={column.id}
          className="p-3 group flex items-center gap-x-3 cursor-pointer hover:bg-gray-100"
          onClick={didAddField(table, column)}
        >
          <span>
            <Chip color="gray">{table.name}</Chip>.{column.name}
          </span>
          <span className="invisible group-hover:visible text-gray-400 text-sm">
            {FIELD_TYPE_DEFAULT_ACTION[dataType][column.type]}
          </span>
        </Popover.Button>
      ))}
    </ul>
  )
}
