import { TrashIcon, PlusSmIcon, PencilIcon } from "@heroicons/react/outline"
import { Button } from "../../components/Button"
import { Popover } from "../../components/Popover"
import { Title } from "playbook-ui"
import { DashboardQuery, DatasetTableColumnType } from "../../lib/codegenGraphql"
import produce from "immer"
import CodeMirror from "@uiw/react-codemirror"
import { sql, PostgreSQL } from "@codemirror/lang-sql"
import { useModal } from "../../components/Modal"
import reduce from "lodash/reduce"
import map from "lodash/map"
import findIndex from "lodash/findIndex"
import isEmpty from "lodash/isEmpty"
import React, { Fragment, useContext, useState } from "react"
import dedent from "dedent"
import { Switch } from "../../components/Switch"
import { tw } from "../../lib/tw"
import { template } from "./_helpers"
import { useRef } from "react"
import { useEffect } from "react"

export type BuildInfoWithDatasetFieldsProps = {
  dataset: DashboardQuery["dashboard"]["dataset"]
  buildInfo: any
  onChange: any
}

const Label = tw.div`font-medium mb-2`
const FieldSkeleton = () => {
  return (
    <div
      className="bg-repeat h-16"
      style={{
        backgroundImage:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZBRjVCRjc5NEQzRDExRTM4NzI0OUEwOEVGMTdFN0ZGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZBRjVCRjdBNEQzRDExRTM4NzI0OUEwOEVGMTdFN0ZGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkFGNUJGNzc0RDNEMTFFMzg3MjQ5QTA4RUYxN0U3RkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkFGNUJGNzg0RDNEMTFFMzg3MjQ5QTA4RUYxN0U3RkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6OV1kjAAAAUklEQVR42mLavHnzISBW+v//PwMuzOTj42PHwMCwYMuWLUoMOAATiCCkkAnGwKeQCZmDSyETui5sCpmwuQFdISPIi7gAUNEhIJWAVxFMIUCAAQBCMT4o+pmFmwAAAABJRU5ErkJggg==)",
      }}
    />
  )
}
const Context = React.createContext<BuildInfoWithDatasetFieldsProps>({} as BuildInfoWithDatasetFieldsProps)
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
    alias: "# of unique years in :field",
    formula: "COUNT(DISTINCT EXTRACT(YEAR FROM :field))",
  },
}

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
          disabled={buildInfo.values.length == 0 || buildInfo.rows.length == 0}
          initialValue={buildInfo.rowTotals}
          didChange={didUpdateRowsTotal}
          className="mr-3"
        />
        <Switch
          disabled={buildInfo.values.length == 0 || buildInfo.columns.length == 0}
          label="Columns"
          initialValue={buildInfo.columnTotals}
          didChange={didUpdateColumnsTotal}
        />
      </div>
    </Context.Provider>
  )
}

const DimensionSection = ({ label, section }) => {
  const { buildInfo, onChange } = useContext(Context)

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

  const didEditAlias = () => {
    console.log("dblc")
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
          <QuickAdd measure={false} didAdd={didQuickAddField} />
        </Popover>
      </header>

      {isEmpty(buildInfo[section]) && <FieldSkeleton />}

      {buildInfo[section].map((item, index) => (
        <div key={item.alias} className="mb-2 border bg-white">
          <div className="border-b py-1 px-2 flex justify-between items-center">
            <ColumnAlias item={item} section={section} />
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

  const didQuickAddField = (table, column) => () => {
    const defaultAgg = DEFAULT_AGG[column.type]
    onChange(
      produce(buildInfo, (draft) => {
        draft[section].push({
          formula: template(defaultAgg.formula, { field: `${table.name}.${column.name}` }),
          alias: template(defaultAgg.alias, { field: column.name }),
        })
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
  const didUpdateFormula = (formula) => {
    onChange(
      produce(buildInfo, (draft) => {
        const index = findIndex(buildInfo[section], (item) => item === item)
        draft[section][index].formula = formula
      })
    )
    hideModal()
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
          <QuickAdd measure didAdd={didQuickAddField} />
        </Popover>
      </header>

      {isEmpty(buildInfo[section]) && <FieldSkeleton />}

      {buildInfo[section].map((item, index) => (
        <Fragment key={item.alias}>
          <Modal $lg>
            <FieldFormula item={item} didUpdateFormula={didUpdateFormula} />
          </Modal>

          <div className="my-2 border bg-white group">
            <div className="border-b py-1 px-2 flex justify-between items-center">
              <ColumnAlias item={item} section={section} />
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

const QuickAdd = ({ measure, didAdd }: { measure?: boolean; didAdd: any }) => {
  const { dataset } = useContext(Context)
  return (
    <div className="flex flex-col max-h-96 overflow-auto w-[270px]">
      {dataset.tables.map((table) => (
        <div key={table.id}>
          <p className="font-medium p-3 border-b sticky top-0 bg-gray-100">{table.title}</p>
          <ul>
            {table.columns.map((column) => (
              <Popover.Button
                as="li"
                key={column.id}
                className="p-3 group flex items-center gap-x-3 cursor-pointer hover:bg-gray-100"
                onClick={didAdd(table, column)}
              >
                <span>{column.name}</span>
                <span className="invisible group-hover:visible text-gray-400 text-sm">
                  {measure ? DEFAULT_AGG[column.type].label : "All items"}
                </span>
              </Popover.Button>
            ))}
          </ul>
        </div>
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

const ColumnAlias = ({ item, section }) => {
  const [editing, setEditing] = useState(false)
  const { onChange, buildInfo } = useContext(Context)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const didClickToEdit = () => {
    setEditing(true)
  }
  const didUpdateAlias = (e) => {
    onChange(
      produce(buildInfo, (draft) => {
        const index = findIndex(buildInfo[section], (item) => item === item)
        draft[section][index].alias = e.target.value
      })
    )
    setEditing(false)
  }
  useEffect(() => {
    editing && inputRef.current?.focus()
  }, [editing])
  const didPressKey = (e) => {
    e.key == "Enter" && didUpdateAlias(e)
  }

  return (
    <span className="w-full hover:bg-gray-100 cursor-default" onDoubleClick={didClickToEdit}>
      {editing ? (
        <input
          ref={inputRef}
          className="w-full"
          defaultValue={item.alias}
          onBlur={didUpdateAlias}
          onKeyDown={didPressKey}
        />
      ) : (
        item.alias
      )}
    </span>
  )
}
