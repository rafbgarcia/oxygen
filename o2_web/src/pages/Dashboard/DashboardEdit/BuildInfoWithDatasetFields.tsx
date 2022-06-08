import { TrashIcon, PlusSmIcon, PencilIcon } from "@heroicons/react/outline"
import { Button } from "../../../components/Button"
import { Popover } from "../../../components/Popover"
import { Title } from "playbook-ui"
import { DashboardQuery, DatasetTableColumnType } from "../../../lib/codegenGraphql"
import produce from "immer"
import { Chip } from "../../../components/Chip"
import CodeMirror from "@uiw/react-codemirror"
import { sql, PostgreSQL } from "@codemirror/lang-sql"
import { useModal } from "../../../components/Modal"
import { reduce, map, findIndex } from "lodash-es"
import React, { useContext, useState } from "react"

type SectionType = { renderDataKey: string; label: string; dataType: DataType }
export type BuildInfoSections = Array<SectionType>
export type BuildInfoWithDatasetFieldsProps = {
  dataset: DashboardQuery["dashboard"]["dataset"]
  buildInfo: any
  onChange: any
}
export enum DataType {
  MEASURE = "Measure",
  DIMENSION = "Dimension",
}

const AGGREGATIONS = ["COUNT", "COUNT DISTINCT", "SUM"]
const FUNCTIONS = ["CONTRIBUTION"]

const Context = React.createContext<BuildInfoWithDatasetFieldsProps>({} as BuildInfoWithDatasetFieldsProps)

export const BuildInfoWithDatasetFields = ({
  dataset,
  buildInfo,
  onChange,
}: BuildInfoWithDatasetFieldsProps) => {
  const context = { dataset, onChange, buildInfo }

  return (
    <Context.Provider value={context}>
      {buildInfo.sections.map((section) => (
        <Section key={section.renderDataKey} section={section} />
      ))}
    </Context.Provider>
  )
}

const Section = ({ section }: { section: SectionType }) => {
  const { buildInfo, onChange } = React.useContext(Context)

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
            {section.dataType === DataType.DIMENSION ? (
              <QuickAddDimension section={section} />
            ) : (
              <QuickAddMeasure section={section} />
            )}
          </Popover>
        </header>

        {buildInfo[section.renderDataKey].map((item, index) =>
          section.dataType === DataType.MEASURE ? (
            <SectionItemMeasure
              key={item.alias}
              item={item}
              section={section}
              onRemove={didRemoveField(index)}
            />
          ) : (
            <SectionItemDimension key={item.alias} item={item} onRemove={didRemoveField(index)} />
          )
        )}
      </div>
    </div>
  )
}

const SectionItemMeasure = ({
  item,
  onRemove,
  section,
}: {
  item: any
  onRemove: any
  section: SectionType
}) => {
  const { hideModal, showModal, Modal } = useModal()
  const { buildInfo, onChange } = useContext(Context)

  const didUpdateFormula = (formula) => {
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      const index = findIndex(buildInfo[section.renderDataKey], (item) => item === item)
      draft[section.renderDataKey][index].formula = formula
    })
    onChange(updatedBuildInfo)
    hideModal()
  }

  return (
    <>
      <Modal $lg>
        <FieldFormula didUpdateFormula={didUpdateFormula} />
      </Modal>

      <div className="my-2 border bg-white group">
        <div className="border-b py-1 px-2 flex justify-between items-center">
          <span>{item.alias}</span>
          <a className="cursor-pointer hidden group-hover:block" onClick={showModal}>
            <PencilIcon className="w-4" />
          </a>
        </div>
        <div className="p-2 flex justify-between items-center">
          <a className="cursor-pointer" onClick={onRemove}>
            <TrashIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  )
}

const SectionItemDimension = ({ item, onRemove }: { item: any; onRemove: any }) => {
  return (
    <div className="my-2 border bg-white">
      <div className="border-b py-1 px-2 flex justify-between items-center">
        <span>{item.alias}</span>
      </div>
      <div className="p-2 flex justify-between items-center">
        <a className="cursor-pointer" onClick={onRemove}>
          <TrashIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

const FieldFormula = ({ didUpdateFormula }) => {
  const { dataset } = React.useContext(Context)
  const [formula, setFormula] = useState("")
  const didSave = () => didUpdateFormula(formula)

  return (
    <div className="p-4">
      <Title size={4}>Edit Aggregation Formula</Title>
      <FormulaEditor dataset={dataset} didUpdateFormula={setFormula} />

      <div className="mt-4 text-right">
        <Button onClick={didSave}>Save</Button>
      </div>
    </div>
  )
}

const QuickAddDimension = ({ section }: { section: SectionType }) => {
  const { buildInfo, dataset, onChange } = React.useContext(Context)

  const didAddField = (table, column) => () => {
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      const item = { formula: `${table.tableName}.${column.name}`, alias: column.name }
      draft[section.renderDataKey].push(item)
    })
    onChange(updatedBuildInfo)
  }

  return (
    <div className="flex flex-col gap-y-8 max-h-96 overflow-y-auto min-w-fit">
      {dataset.tables.map((table) => (
        <ul key={table.id}>
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
              <span className="invisible group-hover:visible text-gray-400 text-sm">All items</span>
            </Popover.Button>
          ))}
        </ul>
      ))}
    </div>
  )
}

const template = (formula, values) => {
  return reduce(values, (acc, value, placeholder) => acc.replaceAll(`:${placeholder}`, value), formula)
}

const DEFAULT_AGG = {
  [DatasetTableColumnType.Text]: {
    label: "Count Unique",
    alias: "# of unique :field",
    formula: "COUNT(DISTINCT :field)",
  },
  [DatasetTableColumnType.Integer]: { label: "Sum", alias: "total :field", formula: "SUM(:field)" },
  [DatasetTableColumnType.Float]: { label: "Sum", alias: "total :field", formula: "SUM(:field)" },
  [DatasetTableColumnType.Datetime]: {
    label: "# of years",
    alias: "# of unique :field",
    formula: "COUNT(DISTINCT EXTRACT(YEAR FROM :field))",
  },
}
const QuickAddMeasure = ({ section }: { section: SectionType }) => {
  const { buildInfo, dataset, onChange } = React.useContext(Context)

  const didAddField = (table, column) => () => {
    const defaultAgg = DEFAULT_AGG[column.type]
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      draft[section.renderDataKey].push({
        formula: template(defaultAgg.formula, { field: `${table.tableName}.${column.name}` }),
        alias: template(defaultAgg.alias, { field: column.name }),
      })
    })
    onChange(updatedBuildInfo)
  }

  return (
    <div className="flex flex-col gap-y-8 max-h-96 overflow-y-auto min-w-fit">
      {dataset.tables.map((table) => (
        <ul key={table.id}>
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
                {DEFAULT_AGG[column.type].label}
              </span>
            </Popover.Button>
          ))}
        </ul>
      ))}
    </div>
  )
}

const FormulaEditor = ({ dataset, didUpdateFormula }) => {
  const schema = reduce(dataset.tables, (acc, table) => ({ [table.name]: map(table.columns, "name") }), {})
  const didChange = (value, viewUpdate) => {
    didUpdateFormula(value)
  }

  return (
    <CodeMirror
      value=""
      height="200px"
      className="border mt-2"
      placeholder={`COUNT(DISTINCT "Table Name".field_name)`}
      extensions={[sql({ dialect: PostgreSQL, upperCaseKeywords: true, schema })]}
      onChange={didChange}
    />
  )
}
