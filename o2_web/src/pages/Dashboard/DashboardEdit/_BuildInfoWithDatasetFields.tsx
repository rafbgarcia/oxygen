import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Button } from "../../../components/Button"
import { Popover } from "../../../components/Popover"
import { Title } from "playbook-ui"
import type { DashboardQuery } from "../../../lib/codegenGraphql"
import produce from "immer"

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
            <div className="flex flex-col gap-y-8 max-h-96">
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
    Text: "Count Unique",
    Integer: "Sum",
    Float: "Sum",
    DateTime: "# of years",
  },
  [dataType.DIMENSION]: {
    Text: "All Items",
    Integer: "All Items",
    Float: "All Items",
    DateTime: "All Items",
  },
}
const TableColumns = ({ table, dataType, didAddField }) => {
  return (
    <div>
      <div className="p-4 border-b">
        <Title size={4}>{table.name}</Title>
      </div>
      <ul>
        {table.columns.map((column) => (
          <Popover.Button
            as="li"
            key={column.id}
            className="py-2 px-6 group flex items-center gap-x-3 cursor-pointer hover:bg-gray-100"
            onClick={didAddField(table, column)}
          >
            {column.name}
            <span className="invisible group-hover:visible text-gray-300 text-sm">
              {FIELD_TYPE_DEFAULT_ACTION[dataType][column.type]}
            </span>
          </Popover.Button>
        ))}
      </ul>
    </div>
  )
}
