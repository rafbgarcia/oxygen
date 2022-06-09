import { TrashIcon, PlusSmIcon, PencilIcon } from "@heroicons/react/outline"
import { Button } from "../../components/Button"
import { Popover } from "../../components/Popover"
import { Title } from "playbook-ui"
import { DashboardQuery, DatasetTableColumnType } from "../../lib/codegenGraphql"
import produce from "immer"
import { Chip } from "../../components/Chip"
import CodeMirror from "@uiw/react-codemirror"
import { sql, PostgreSQL } from "@codemirror/lang-sql"
import { useModal } from "../../components/Modal"
import { reduce, map, findIndex } from "lodash-es"
import React, { Fragment, useContext, useState } from "react"
import dedent from "dedent"
import { Switch } from "../../components/Switch"
import { tw } from "../../lib/tw"

export type BuildInfoWithDatasetFieldsProps = {
  dataset: DashboardQuery["dashboard"]["dataset"]
  buildInfo: any
  onChange: any
}

const Context = React.createContext<BuildInfoWithDatasetFieldsProps>({} as BuildInfoWithDatasetFieldsProps)

const Label = tw.div`font-medium mb-2`

export const PivotBuild = ({ dataset, buildInfo, onChange }: BuildInfoWithDatasetFieldsProps) => {
  const context = { dataset, onChange, buildInfo }
  const didUpdateRowsTotal = (value) => onChange({ ...buildInfo, rowTotals: value })
  const didUpdateColumnsTotal = (value) => onChange({ ...buildInfo, columnTotals: value })

  return (
    <Context.Provider value={context}>
      <DimensionSection label="Rows" section="rows" />
      <SectionMeasure label="Values" section="values" />
      <DimensionSection label="Columns" section="columns" />

      <Label>Grand Totals</Label>
      <div className="flex items-center ">
        <Switch
          label="Rows"
          initialValue={buildInfo.rowTotals}
          didChange={didUpdateRowsTotal}
          className="mr-3"
        />
        <Switch label="Columns" initialValue={buildInfo.columnTotals} didChange={didUpdateColumnsTotal} />
      </div>
    </Context.Provider>
  )
}

const DimensionSection = ({ label, section }) => {
  const { buildInfo, dataset, onChange } = useContext(Context)

  const didQuickAddField = (table, column) => () => {
    onChange(
      produce(buildInfo, (draft) => {
        const item = { formula: `${table.name}.${column.name}`, alias: column.name }
        draft[section].push(item)
      })
    )
  }
  const didRemoveField = (index) => () => {
    onChange(
      produce(buildInfo, (draft) => {
        draft[section].splice(index, 1)
      })
    )
  }

  return (
    <div className="mb-5">
      <header className="flex items-center justify-between">
        <Label>{label}</Label>

        <Popover
          position="bottom-left"
          Button={
            <Button className="flex items-center" $iconXs>
              <PlusSmIcon className="w-4 h-4" />
            </Button>
          }
        >
          <div className="flex flex-col gap-y-8 max-h-96 overflow-auto w-[270px]">
            {dataset.tables.map((table) => (
              <div key={table.id}>
                <p className="font-medium p-3 border-b">{table.title}</p>
                <ul>
                  {table.columns.map((column) => (
                    <Popover.Button
                      as="li"
                      key={column.id}
                      className="p-3 group flex items-center gap-x-3 cursor-pointer hover:bg-gray-100"
                      onClick={didQuickAddField(table, column)}
                    >
                      <span>{column.name}</span>
                      <span className="invisible group-hover:visible text-gray-400 text-sm">All items</span>
                    </Popover.Button>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Popover>
      </header>

      {buildInfo[section].map((item, index) => (
        <div key={item.alias} className="mb-2 border bg-white">
          <div className="border-b py-1 px-2 flex justify-between items-center">
            <span>{item.alias}</span>
          </div>
          <div className="p-2 flex justify-between items-center">
            <a className="cursor-pointer" onClick={didRemoveField(index)}>
              <TrashIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

const SectionMeasure = ({ label, section }) => {
  const { buildInfo, onChange } = useContext(Context)
  const { hideModal, showModal, Modal } = useModal()

  const didUpdateFormula = (formula) => {
    onChange(
      produce(buildInfo, (draft) => {
        const index = findIndex(buildInfo[section], (item) => item === item)
        draft[section][index].formula = formula
      })
    )
    hideModal()
  }
  const didRemoveField = (index) => () => {
    onChange(
      produce(buildInfo, (draft) => {
        draft[section].splice(index, 1)
      })
    )
  }

  return (
    <div className="mb-5">
      <header className="flex items-center justify-between">
        <span className="font-medium">{label}</span>

        <Popover
          position="bottom-left"
          Button={
            <Button className="flex items-center" $iconXs>
              <PlusSmIcon className="w-4 h-4" />
            </Button>
          }
        >
          <QuickAddMeasure section={section} />
        </Popover>
      </header>

      {buildInfo[section].map((item, index) => (
        <Fragment key={item.alias}>
          <Modal $lg>
            <FieldFormula item={item} didUpdateFormula={didUpdateFormula} />
          </Modal>

          <div className="my-2 border bg-white group">
            <div className="border-b py-1 px-2 flex justify-between items-center">
              <span>{item.alias}</span>
              <a className="cursor-pointer hidden group-hover:block" onClick={showModal}>
                <PencilIcon className="w-4" />
              </a>
            </div>
            <div className="p-2 flex justify-between items-center">
              <a className="cursor-pointer" onClick={didRemoveField(index)}>
                <TrashIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

enum QuickFunction {
  "COUNT" = "COUNT",
  "COUNT DISTINCT" = "COUNT_DISTINCT",
  "SUM" = "SUM",
  "CASE" = "CASE",
  "CONTRIBUTION" = "CONTRIBUTION",
}
const QUICK_FUNCTIONS: Record<QuickFunction, string> = {
  SUM: "SUM(table.column)",
  COUNT: "COUNT(table.column)",
  COUNT_DISTINCT: "COUNT(DISTINCT table.column)",
  CASE: dedent(`
    CASE
        WHEN condition_1 THEN result_1
        WHEN condition_2 THEN result_2
        [ELSE else_result]
    END
  `),
  CONTRIBUTION: dedent(`
    COUNT(DISTINCT table.column)::FLOAT / SUM(COUNT(DISTINCT table.column)) OVER ()
  `),
}

const FieldFormula = ({ item, didUpdateFormula }) => {
  const { dataset } = useContext(Context)
  const [formula, setFormula] = useState(item.formula)

  const schema = reduce(dataset.tables, (acc, table) => ({ [table.name]: map(table.columns, "name") }), {})
  const didSave = () => didUpdateFormula(formula.trim())

  const didAddFunction = (quickFn) => () => {
    const nl = formula.length > 0 ? "\n" : ""
    setFormula(nl + QUICK_FUNCTIONS[quickFn])
  }
  return (
    <div className="p-4">
      <Title size={4}>Edit Aggregation Formula</Title>
      <CodeMirror
        autoFocus
        value={formula}
        className="border mt-2"
        height="150px"
        placeholder={`COUNT(DISTINCT "Table Name".field_name)`}
        extensions={[sql({ dialect: PostgreSQL, upperCaseKeywords: true, schema })]}
        onChange={setFormula}
      />

      <div className="bg-gray-100 p-4 mt-4">
        <Title size={4}>Quick Functions</Title>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {Object.keys(QuickFunction).map((fn) => (
            <Button key={fn} onClick={didAddFunction(QuickFunction[fn])}>
              {fn}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-right">
        <Button onClick={didSave}>Save</Button>
      </div>
    </div>
  )
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
const QuickAddMeasure = ({ section }: { section: string }) => {
  const { buildInfo, dataset, onChange } = useContext(Context)

  const didAddField = (table, column) => () => {
    const defaultAgg = DEFAULT_AGG[column.type]
    const updatedBuildInfo = produce(buildInfo, (draft) => {
      draft[section].push({
        formula: template(defaultAgg.formula, { field: `${table.name}.${column.name}` }),
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
