import { Button } from "playbook-ui"
import { useNavigate, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useCreateWidgetMutation, useDashboardQuery, WidgetType } from "../../lib/codegenGraphql"
import { DashboardLayout } from "./DashboardLayout"
import { Popover } from "../../components/Popover"
import { ChartBarIcon, TableIcon } from "@heroicons/react/outline"

const initialLayout = { i: "", w: 12, h: 10, x: 0, y: 0 }

export const DashboardEdit = () => {
  const { dashboardId } = useParams()
  const navigate = useNavigate()
  const { error, data } = useDashboardQuery({ variables: { id: dashboardId! } })
  const [createWidget] = useCreateWidgetMutation()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const handleCreateWidget = (type: WidgetType) => () => {
    const variables = { dashboardId: dashboardId!, widgetType: type, layout: initialLayout }

    createWidget({ variables }).then(({ data }) => {
      navigate(`/dashboards/${dashboardId}/widgets/${data?.createWidget?.widget.id}/edit`)
    })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>
          Dashboards {">"} {data?.dashboard.name}
        </Page.Title>
        <Popover
          position="bottom-left"
          Button={
            <Button size="sm" onClick={() => {}} variant="secondary">
              + Widget
            </Button>
          }
        >
          <ul className="whitespace-nowrap">
            <li
              className="p-4 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100"
              onClick={handleCreateWidget(WidgetType.PivotTable)}
            >
              <TableIcon className="w-4" />
              Pivot Table
            </li>
            <li
              className="p-4 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100"
              onClick={handleCreateWidget(WidgetType.VerticalBarChart)}
            >
              <ChartBarIcon className="w-4" />
              Vertical Bar Chart
            </li>
          </ul>
        </Popover>
      </Page.Header>
      <Page.Main>
        <DashboardLayout dashboard={data?.dashboard} />
      </Page.Main>
    </>
  )
}
