import { Button } from "playbook-ui"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useCreateWidgetMutation, useDashboardQuery, WidgetType } from "../../lib/codegenGraphql"
import { DashboardLayout } from "./DashboardLayout"
import { Popover } from "../../components/Popover"
import { ChartBarIcon, TableIcon } from "@heroicons/react/outline"
import { initialBuildInfo } from "./DashboardEdit/initialBuildInfo"

const initialLayout = { w: 12, h: 15, x: 0, y: 0 }

export const DashboardEdit = () => {
  const { dashboardId, widgetId } = useParams()
  const navigate = useNavigate()
  const { error, data } = useDashboardQuery({ variables: { id: dashboardId! } })
  const [createWidget] = useCreateWidgetMutation()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const handleCreateWidget = (type: WidgetType) => () => {
    createWidget({
      variables: {
        dashboardId: dashboardId!,
        widgetType: type,
        layout: initialLayout,
        buildInfo: initialBuildInfo[type],
      },
    }).then(({ data }) => {
      navigate(`/dashboards/${dashboardId}/widgets/${data?.createWidget?.widget.id}/edit`)
    })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>
          Dashboards {">"} {data!.dashboard.name}
        </Page.Title>
        <Popover
          position="bottom-left"
          Button={
            <Button onClick={() => {}} variant="secondary">
              + Widget
            </Button>
          }
        >
          <ul className="whitespace-nowrap">
            <Popover.Button
              as="li"
              className="p-4 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100"
              onClick={handleCreateWidget(WidgetType.PivotTable)}
            >
              <TableIcon className="w-4" />
              Pivot Table
            </Popover.Button>
            <Popover.Button
              as="li"
              className="p-4 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100"
              onClick={handleCreateWidget(WidgetType.VerticalBarChart)}
            >
              <ChartBarIcon className="w-4" />
              Vertical Bar Chart
            </Popover.Button>
          </ul>
        </Popover>
      </Page.Header>
      <Page.Main>
        <div className="flex items-start">
          <div className="flex-grow flex-shrink basis-full">
            <DashboardLayout
              key={data?.dashboard.widgets.length}
              dashboard={data?.dashboard!}
              activeWidgetId={widgetId}
            />
          </div>
          <div className="flex-grow-1 flex-shrink basis-0">
            <Outlet context={{ dashboard: data!.dashboard }} />
          </div>
        </div>
      </Page.Main>
    </>
  )
}
