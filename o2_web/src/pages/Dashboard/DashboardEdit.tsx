import { Button, Body, Title, Avatar } from "playbook-ui"
import { Link, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useModal } from "../../components/Modal"
import { useForm } from "react-hook-form"
import { TextField } from "../../components/TextField"
import { useDashboardQuery } from "../../lib/codegenGraphql"

export const DashboardEdit = () => {
  const { dashboardId } = useParams()
  const { error, data } = useDashboardQuery({ variables: { id: dashboardId! } })

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <Page.Header $flex>
        <Page.Title>Dashboards</Page.Title>
        <Button size="sm" onClick={() => {}} variant="secondary">
          + Dashboard
        </Button>
      </Page.Header>
      <Page.Main className="container m-auto max-w-screen-lg">
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 p-4"></div>
      </Page.Main>
    </>
  )
}
