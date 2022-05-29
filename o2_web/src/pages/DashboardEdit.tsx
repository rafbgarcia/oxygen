import { Link, useParams } from "react-router-dom"
import { Button } from "../components/Button"
import { Wait } from "../components/Wait"
import { api } from "../lib/api"
import { Page } from "./Page"
import { PlusSmIcon, ViewListIcon } from "@heroicons/react/outline"
import { Dashboard } from "../components/Dashboard"

export const DashboardEdit = () => {
  const { id } = useParams()
  const { data, error } = api.getDashboard(id)

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header className="flex items-center gap-x-2">
        <Link to={`/dashboards/${id}/widgets/new`}>
          <Button className="flex items-center">
            Rows
            <ViewListIcon className="h-4 w-4" />
          </Button>
        </Link>
        <Link to={`/dashboards/${id}/widgets/new`}>
          <Button className="flex items-center">
            Add Widget
            <PlusSmIcon className="h-4 w-4" />
          </Button>
        </Link>
      </Page.Header>
      <Page.Main>
        <Dashboard data={data} />
      </Page.Main>
    </>
  )
}
