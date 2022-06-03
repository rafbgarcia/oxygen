import { Button, Title } from "playbook-ui"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useDeleteWidgetMutation, useUpdateWidgetBuildInfoMutation } from "../../../lib/codegenGraphql"
import type { DashboardQuery, WidgetType } from "../../../lib/codegenGraphql"
import { find } from "lodash-es"
import React from "react"
import { Spinner } from "../../../components/Spinner"
import { BuildInfoWithDatasetFields } from "./_BuildInfoWithDatasetFields"

const WIDGET_TYPE_ELEMENT = {
  PIVOT_TABLE: BuildInfoWithDatasetFields,
  VERTICAL_BAR_CHART: BuildInfoWithDatasetFields,
}

export const WidgetEdit = () => {
  const { dashboard } = useOutletContext<{ dashboard: DashboardQuery["dashboard"] }>()
  const { widgetId } = useParams()
  const navigate = useNavigate()
  const [updateBuildInfo, { loading }] = useUpdateWidgetBuildInfoMutation()
  const [removeWidget, { loading: deleting }] = useDeleteWidgetMutation()

  const widget = find(dashboard.widgets, { id: widgetId }) as
    | DashboardQuery["dashboard"]["widgets"][0]
    | undefined

  const didCancelEdit = () => navigate(`/dashboards/${dashboard.id}`)
  const didChangeBuildInfo = (buildInfo) => {
    updateBuildInfo({ variables: { buildInfo, widgetId: widgetId! } })
  }
  const didRemoveWidget = () => {
    removeWidget({ variables: { widgetId: widgetId! } }).then(didCancelEdit)
  }

  return (
    <aside className="bg-white h-full z-10 w-[300px] min-h-screen shadow-md">
      <div className="p-4">
        <header className="flex items-center mb-10">
          <Title size={4}>Pivot Table</Title>
          {loading && <Spinner $size="sm" />}
        </header>

        {widget ? (
          React.createElement(WIDGET_TYPE_ELEMENT[widget.type], {
            onChange: didChangeBuildInfo,
            dataset: dashboard.dataset,
            buildInfo: widget.buildInfo,
          })
        ) : (
          <p className="mb-5">Widget not found</p>
        )}

        <div className="flex items-center gap-x-2">
          <Button variant="secondary" onClick={didCancelEdit}>
            Close
          </Button>
          <Button variant="secondary" onClick={didRemoveWidget} loading={deleting}>
            Remove
          </Button>
        </div>
      </div>
    </aside>
  )
}
