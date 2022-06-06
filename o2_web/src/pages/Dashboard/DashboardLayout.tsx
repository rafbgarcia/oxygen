import { Widget } from "../../components/Widget"
import { Title } from "playbook-ui"
import GridLayout, { WidthProvider } from "react-grid-layout"
import { PencilAltIcon } from "@heroicons/react/outline"
import { useNavigate, useParams } from "react-router-dom"
import { useUpdateDashboardLayoutMutation } from "../../lib/codegenGraphql"
import type { DashboardQuery } from "../../lib/codegenGraphql"
import { classnames } from "../../lib/classnames"
import { tw } from "../../lib/tw"
import { useEffect } from "react"
import map from "lodash/fp/map"
import at from "lodash/fp/at"

const GridLayoutAutoWidth = WidthProvider(GridLayout)
const layoutMatchFields = map(at(["i", "x", "y", "w", "h"]))
const layoutMatch = (layout1, layout2) => {
  return layoutMatchFields(layout1).toString() === layoutMatchFields(layout2).toString()
}

export const DashboardLayout = ({
  dashboard,
  activeWidgetId,
}: {
  dashboard: DashboardQuery["dashboard"]
  activeWidgetId: string | undefined
}) => {
  const [updateLayout] = useUpdateDashboardLayoutMutation()
  const layoutDidChange = (layout) => {
    if (layoutMatch(layout, dashboard.layout)) {
      return
    }
    updateLayout({ variables: { dashboardId: dashboard.id, layout } })
  }

  useEffect(() => {
    /**
     * This hack causes widgets width to get recalculated and adapt to the grid width
     * change, which doesn't happen automatically.
     */
    setTimeout(() => window.dispatchEvent(new Event("resize")), 0)
  }, [activeWidgetId])

  return (
    <section>
      <GridLayoutAutoWidth
        layout={dashboard.layout}
        cols={12}
        rowHeight={10}
        onLayoutChange={layoutDidChange}
        compactType={"vertical"}
        measureBeforeMount
        autoSize
      >
        {dashboard.widgets.map((widget) => {
          const widgetContainerClasses = classnames("relative h-full overflow-auto", {
            "border-dashed border-2 border-gray-300": !widget.renderData && widget.id != activeWidgetId,
            "ring-2": widget.id == activeWidgetId,
          })
          return (
            <div key={widget.id} className="relative group">
              <WidgetActions widgetId={widget.id} />

              <figure className={widgetContainerClasses}>
                <Widget type={widget.type} renderData={widget.renderData || {}} />
              </figure>
            </div>
          )
        })}
      </GridLayoutAutoWidth>
    </section>
  )
}

const WidgetActionsContainer = tw.div`
  absolute top-0 left-0 w-full p-2 text-right z-10
  hidden group-hover:block
`

const WidgetActionsButton = tw.a`
  bg-white shadow-md p-2 rounded-md
  cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100
`

const WidgetActions = ({ widgetId }) => {
  const { dashboardId } = useParams()
  const navigate = useNavigate()
  const didClickEdit = () => navigate(`/dashboards/${dashboardId}/widgets/${widgetId}/edit`)

  return (
    <WidgetActionsContainer>
      <WidgetActionsButton onClick={didClickEdit}>
        <PencilAltIcon className="w-6 inline-block" />
      </WidgetActionsButton>
    </WidgetActionsContainer>
  )
}
