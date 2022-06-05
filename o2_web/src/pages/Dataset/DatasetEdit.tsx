import React from "react"
import { Button } from "playbook-ui"
import { Link, Outlet, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { PlayIcon } from "@heroicons/react/solid"
import { TableIcon, PlusSmIcon, MenuIcon, HashtagIcon, CalendarIcon } from "@heroicons/react/outline"
import {
  DatasetQuery,
  useBuildDatasetMutation,
  useDatasetQuery,
  DatasetTableColumnType,
} from "../../lib/codegenGraphql"
import { classnames } from "../../lib/classnames"
import { toast } from "react-toastify"

const FIELD_TYPE_ICON: Record<DatasetTableColumnType, any> = {
  [DatasetTableColumnType.Text]: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <MenuIcon className="w-3" />
    </div>
  ),
  [DatasetTableColumnType.Integer]: () => (
    <div className="border border-gray-500 rounded-sm p-0.5">
      <HashtagIcon className="w-3" />
    </div>
  ),
  [DatasetTableColumnType.Float]: () => FIELD_TYPE_ICON["Integer"](),
  [DatasetTableColumnType.Datetime]: () => (
    <div className="p-0.5">
      <CalendarIcon className="w-4" />
    </div>
  ),
}

export const DatasetEdit = () => {
  const { datasetId, tableId } = useParams()
  const { data, error } = useDatasetQuery({ variables: { id: datasetId! } })
  const [buildDataset, { loading: building }] = useBuildDatasetMutation()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const handleBuild = () => {
    buildDataset({ variables: { id: datasetId! } }).then(() => {
      toast.info("Build complete!")
    })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>
          Datasets {">"} {data?.dataset.name}
        </Page.Title>
        <Link to={`/datasets/${datasetId}/tables/new`} className="ml-auto">
          <Button size="md" variant="secondary">
            <span className="flex items-center gap-x-1">
              <PlusSmIcon className="w-4" /> Table
            </span>
          </Button>
        </Link>
        <Button size="md" variant="secondary" onClick={handleBuild} loading={building}>
          <span className="flex items-center gap-x-1">
            <PlayIcon className="w-4" />
            Build
          </span>
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="flex items-start">
          <div className={`bg-white w-[305px] min-h-[calc(100vh-98px)] h-full  shadow-md`}>
            <TableFields dataset={data!.dataset} tableId={tableId} />
          </div>
          <div className="p-4 overflow-auto max-w-[calc(100vw-340px)]">
            <Outlet context={{ dataset: data?.dataset }} />
          </div>
        </div>
      </Page.Main>
    </>
  )
}

const TableFields = ({ dataset, tableId }: { dataset: DatasetQuery["dataset"]; tableId?: string }) => {
  if (dataset.tables.length == 0) {
    return <p className="p-4">No tables</p>
  }

  return (
    <>
      {dataset.tables.map((table) => (
        <div key={table.id}>
          <ul>
            <li>
              <Link
                to={`/datasets/${dataset.id}/tables/${table.id}`}
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
            {table.columns.map((column) => (
              <li
                key={column.id}
                className="flex items-center gap-x-2 py-3 pl-10 pr-3 hover:bg-gray-100 cursor-default"
              >
                {React.createElement(FIELD_TYPE_ICON[column.type])}
                {column.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
