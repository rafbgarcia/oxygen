import { Button } from "playbook-ui"
import { Link, Outlet, useParams } from "react-router-dom"
import { Page } from "./Page"
import { Wait } from "../components/Wait"
import { PlayIcon } from "@heroicons/react/solid"
import {
  TableIcon,
  PlusSmIcon,
  MenuIcon,
  HashtagIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/outline"
import { useDatasetQuery } from "../lib/codegenGraphql"
import { classnames } from "../lib/classnames"
import React from "react"

const FIELD_TYPE_ICON = {
  Text: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <MenuIcon className="w-3" />
    </div>
  ),
  Integer: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <HashtagIcon className="w-3" />
    </div>
  ),
  Float: () => FIELD_TYPE_ICON["Integer"](),
  DateTime: () => (
    <div className="p-0.5">
      <CalendarIcon className="w-4" />
    </div>
  ),
}

export const DatasourcesEdit = () => {
  const { datasetId, tableId } = useParams()
  const { data, error } = useDatasetQuery({ variables: { id: datasetId! } })

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header $flex>
        <Page.Title>{data?.dataset.name}</Page.Title>
        <Link to={`/datasets/${datasetId}/tables/new`} className="ml-auto">
          <Button size="md" variant="secondary">
            <span className="flex items-center gap-x-1">
              <PlusSmIcon className="w-4" /> Table
            </span>
          </Button>
        </Link>
        <Button size="md" variant="secondary">
          <span className="flex items-center gap-x-1">
            <PlayIcon className="w-4" />
            Build
          </span>
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="flex items-start">
          <div className={`bg-white w-[305px] min-h-[calc(100vh-98px)] h-full  shadow-md`}>
            {data?.dataset.tables.length == 0 && <p className="p-4">No tables</p>}
            {data?.dataset.tables.map((table) => (
              <div key={table.id}>
                <ul>
                  <li>
                    <Link
                      to={`/datasets/${datasetId}/tables/${table.id}`}
                      className={classnames(
                        "group flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-100",
                        { "bg-gray-100": tableId == table.id }
                      )}
                    >
                      <TableIcon className="w-5 text-gray-400 group-hover:text-gray-500" />
                      {table.name}
                    </Link>
                  </li>
                </ul>
                <ul className={classnames({ hidden: tableId != table.id })}>
                  {table.fields.map((field) => (
                    <li
                      key={field.name}
                      className="flex items-center gap-x-2 py-3 pl-10 pr-3 hover:bg-gray-100 cursor-default"
                    >
                      {React.createElement(FIELD_TYPE_ICON[field.type])}

                      {field.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="p-4 overflow-auto max-w-[calc(100vw-340px)]">
            <Outlet context={{ dataset: data?.dataset }} />
          </div>
        </div>
      </Page.Main>
    </>
  )
}
