import { Button } from "playbook-ui"
import { Link, Outlet, useParams } from "react-router-dom"
import { Page } from "./Page"
import { Wait } from "../components/Wait"
import { PlayIcon } from "@heroicons/react/solid"
import { TableIcon, PlusSmIcon } from "@heroicons/react/outline"
import { useDatasetQuery } from "../lib/codegenGraphql"

export const DatasourcesEdit = () => {
  const { datasetId } = useParams()
  const { data, error } = useDatasetQuery({ variables: { id: datasetId! } })

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header $flex>
        <Page.Title>{data?.dataset.name}</Page.Title>
        <Link to={`../tables/new`} className="ml-auto">
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
        <div className={`bg-white w-[305px] h-[calc(100vh-98px)] overflow-auto shadow-md`}>
          {data?.dataset.tables.length == 0 && <p className="p-4">No tables</p>}
          {data?.dataset.tables.map((table) => (
            <div key={table.id}>
              <ul>
                <li>
                  <Link
                    to={`../tables/${table.id}/edit`}
                    className="text-gray-500 group flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-100"
                  >
                    <TableIcon className="w-5 text-gray-400 group-hover:text-gray-500" />
                    {table.name}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <Outlet />
      </Page.Main>
    </>
  )
}
