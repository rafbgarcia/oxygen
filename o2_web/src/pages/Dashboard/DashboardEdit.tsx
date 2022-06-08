import { Button } from "playbook-ui"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Page } from "../Page"
import { Wait } from "../../components/Wait"
import { useCreateWidgetMutation, useDashboardQuery, WidgetType } from "../../lib/codegenGraphql"
import { DashboardLayout } from "./DashboardLayout"
import { Popover } from "../../components/Popover"
import { ChartBarIcon, MenuAlt2Icon, TableIcon } from "@heroicons/react/outline"
import { initialBuildInfo } from "../Widget/_initialBuildInfo"
import React from "react"

const initialLayout = (type: WidgetType) => {
  if (type == WidgetType.Text) {
    return { w: 6, h: 3, x: 0, y: 10000 }
  }
  return { w: 12, h: 15, x: 0, y: 10000 }
}
const WIDGET_TYPE_ICON: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: TableIcon,
  [WidgetType.VerticalBarChart]: ChartBarIcon,
  [WidgetType.Text]: MenuAlt2Icon,
}

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
        layout: initialLayout(type),
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
          className="z-20"
          Button={
            <Button onClick={() => {}} variant="secondary">
              + Widget
            </Button>
          }
        >
          <ul className="whitespace-nowrap">
            {Object.keys(WidgetType).map((type) => (
              <Popover.Button
                key={type}
                as="li"
                className="p-4 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100"
                onClick={handleCreateWidget(WidgetType[type])}
              >
                {React.createElement(WIDGET_TYPE_ICON[WidgetType[type]], { className: "w-4" })}
                {type}
              </Popover.Button>
            ))}
          </ul>
        </Popover>
      </Page.Header>
      <Page.Main>
        <div className="flex items-start">
          <div className="flex-grow flex-shrink basis-full">
            <DashboardLayout dashboard={data?.dashboard!} activeWidgetId={widgetId} />
          </div>
          <div className="flex-grow-1 flex-shrink basis-0">
            <Outlet context={{ dashboard: data!.dashboard }} />
          </div>
        </div>
      </Page.Main>
    </>
  )
}
