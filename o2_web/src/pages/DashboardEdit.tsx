import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "../components/Button"
import { Wait } from "../components/Wait"
import { api } from "../lib/api"
import { Page } from "./Page"
import { PlusSmIcon } from "@heroicons/react/outline"
import { filter, map } from "lodash-es"
import { Widget } from "../components/Widget"

const Placeholder = ({ dashboardId }) => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg h-40 m-2 flex items-center justify-center">
      <Link to={`/dashboards/${dashboardId}/widgets/new`}>
        <Button>
          <PlusSmIcon className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}

const Row = ({ row, widgets }) => {
  return (
    <div className="flex items-start justify-evenly gap-x-2 overflow-hidden">
      {map(widgets, (widget) => (
        <div key={widget.id} className="w-full bg-white shadow-md p-2 h-[500] overflow-auto">
          <h5 className="font-medium text-lg">{widget.title}</h5>
          <Widget type={widget.type} meta={{ ...widget.meta, height: 500 }} theme={{}} />
        </div>
      ))}
    </div>
  )
}

export const DashboardEdit = () => {
  const { id } = useParams()
  const { data, error } = api.getDashboard(id)
  const [rows, setRows] = useState<Record<any, any>>([])

  useEffect(() => {
    if (data) {
      setRows(data.rows)
    }
  }, [!!data])

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header>
        <Page.Title>{data.dashboard.name}</Page.Title>
      </Page.Header>
      <Page.Main className="p-2">
        {rows.length == 0 && <Placeholder dashboardId={id} />}
        {rows.map((row) => (
          <Row key={row.id} row={row} widgets={filter(data.widgets, { dashboardRow: row.id })} />
        ))}

        <Placeholder dashboardId={id} />
      </Page.Main>
    </>
  )
}
