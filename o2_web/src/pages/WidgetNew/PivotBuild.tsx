import { api } from "../lib/api"
import { Pivot } from "../components/Pivot"
import { useImmer, useImmerReducer } from "use-immer"
import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { useState } from "react"
import { Page } from "./Page"

const fns = ["COUNT", "SUM", "PERCENT"]

const WidgetBuild = ({ fields, build, updateBuild }) => {
  return (
    <div className="w-3/12 h-screen px-4 py-8 overflow-y-auto bg-gray-100">
      <div className="border-b border-gray-200 pb-3 mb-3">Pivot</div>

      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Rows</p>
        {build.rows.map((row, i) => (
          <div key={row.field} className="flex justify-between items-center mb-1">
            <select className="w-full" defaultValue={row.field}>
              <option key="blank" value="blank">
                Select
              </option>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove("rows", i)}>
              <TrashIcon className="w-4 h-4" />
            </a>
          </div>
        ))}
        <a
          onClick={add("rows")}
          className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min"
        >
          <span>Add</span>
          <span>
            <PlusSmIcon className="w-4 h-4" />
          </span>
        </a>
      </div>

      {/**
       * Values
       **/}
      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Values</p>
        {build.values.map((value, i) => (
          <div key={value.fn + value.field} className="flex justify-between items-center mb-1">
            <select className="w-4/12 mr-1" defaultValue={value.fn}>
              {fns.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select className="w-8/12" defaultValue={value.field}>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove("values", i)}>
              <TrashIcon className="w-4 h-4" />
            </a>
          </div>
        ))}
        <a
          onClick={add("rows")}
          className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min"
        >
          <PlusSmIcon className="w-4 h-4" />
        </a>
      </div>

      <div className="mb-3 pb-3 border-b-2 border-white">
        <p>Columns</p>
        {build.columns.map((column, i) => (
          <div key={column.field} className="flex justify-between items-center mb-1">
            <select className="w-full" defaultValue={column.field}>
              <option key="blank" value="blank">
                Select
              </option>
              {fields.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <a className="cursor-pointer" onClick={remove("columns", i)}>
              <TrashIcon className="w-4 h-4" />
            </a>
          </div>
        ))}
        <a
          onClick={add("columns")}
          className="cursor-pointer px-3 py-1 border border-gray-500 bg-white flex w-min"
        >
          <PlusSmIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

export const PivotBuild = ({ dataset }) => {
  const [buildInfo, dispatch] = useImmerReducer(
    (draft, action) => {
      if (action.type == "add") draft[action.key].push({})
      if (action.type == "remove") draft[action.key].splice(action.index, 1)
    },
    { rows: [] as any, columns: [] as any, values: [] as any }
  )

  return (
    <div className="flex">
      Pivot
      {/* <WidgetBuild fields={fields} build={build} updateBuild={updateBuild} />
      <div className="w-9/12 h-screen px-4 py-8 overflow-y-auto overflow-x-auto shadow-md">
        <Pivot meta={data.meta} theme={{}} />
      </div> */}
      {/* <div className="w-96 h-screen px-4 py-8 overflow-y-auto bg-gray-100"></div> */}
    </div>
  )
}
