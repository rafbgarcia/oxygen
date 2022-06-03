import { Button, Title } from "playbook-ui"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import { Dashboard, useUpdateWidgetBuildInfoMutation, WidgetType } from "../../lib/codegenGraphql"
import { find } from "lodash-es"
import { BuildInfoPivotTable } from "./BuildInfoPivotTable"
import React from "react"
import { Spinner } from "../../components/Spinner"

const WIDGET_TYPE_ELEMENT: { [key in WidgetType]: any } = {
  PIVOT_TABLE: BuildInfoPivotTable,
  VERTICAL_BAR_CHART: () => null,
}

export const WidgetEdit = () => {
  const { dashboard } = useOutletContext<{ dashboard: Dashboard }>()
  const { widgetId } = useParams()
  const navigate = useNavigate()
  const [updateBuildInfo, { loading }] = useUpdateWidgetBuildInfoMutation()

  const widget = find(dashboard.widgets, { id: widgetId })
  const didCancel = () => navigate(`/dashboards/${dashboard.id}`)
  const didChangeBuildInfo = (buildInfo) => {
    updateBuildInfo({ variables: { buildInfo: JSON.stringify(buildInfo), widgetId: widgetId! } })
  }

  return (
    <aside className="bg-white h-full z-10 w-[300px] min-h-screen shadow-md">
      <div className="p-4">
        <header className="flex items-center mb-10">
          <Title size={4}>Pivot Table</Title>
          {loading && <Spinner $size="sm" />}
        </header>

        {React.createElement(WIDGET_TYPE_ELEMENT[widget.type], { onChange: didChangeBuildInfo })}

        <Button variant="secondary" onClick={didCancel}>
          Close
        </Button>
      </div>
    </aside>
  )
}
