import { Widget } from "../../components/Widget"
import GridLayout, { WidthProvider } from "react-grid-layout"
import { PencilAltIcon } from "@heroicons/react/outline"
import { useNavigate } from "react-router-dom"
import { useUpdateDashboardLayoutMutation } from "../../lib/codegenGraphql"
import type { DashboardQuery } from "../../lib/codegenGraphql"
import { classnames } from "../../lib/classnames"
import { tw } from "../../lib/tw"
import map from "lodash/fp/map"
import at from "lodash/fp/at"
import { useEffect } from "react"

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
  const navigate = useNavigate()
  const [updateLayout] = useUpdateDashboardLayoutMutation()
  const didClickToEdit = (widgetId) => () => navigate(`/dashboards/${dashboard.id}/widgets/${widgetId}/edit`)
  const layoutDidChange = (layout) => {
    if (layoutMatch(layout, dashboard.layout)) return
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
        className={classnames("min-h-[2000px]", { "w-[calc(100vw-300px)]": activeWidgetId !== undefined })}
        layout={dashboard.layout}
        cols={12}
        rowHeight={10}
        onLayoutChange={layoutDidChange}
        compactType={"vertical"}
        measureBeforeMount={true}
        autoSize
      >
        {dashboard.widgets.map((widget) => {
          return (
            <WidgetContainer
              key={widget.id}
              onDoubleClick={didClickToEdit(widget.id)}
              className="group"
              $editting={widget.id == activeWidgetId}
            >
              <WidgetActionsContainer>
                <WidgetActionsButton onClick={didClickToEdit(widget.id)}>
                  <PencilAltIcon className="w-5 inline-block" />
                </WidgetActionsButton>
              </WidgetActionsContainer>

              <div className="h-full overflow-auto">
                <Widget widget={widget} dataset={dashboard.dataset} />
              </div>
            </WidgetContainer>
          )
        })}
      </GridLayoutAutoWidth>
    </section>
  )
}

const WidgetActionsContainer = tw.div`
  absolute top-[-13px] right-0 w-full text-right z-10
  hidden group-hover:block
`
const WidgetActionsButton = tw.a`
  bg-white shadow-sm p-1 rounded-md border
  cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100
`
const WidgetContainer = tw.figure`
  relative overflow-hidden

  ${(p) =>
    classnames({
      "ring-2": p.$editting,
      "hover:outline-dashed hover:outline-2 hover:outline-gray-300": !p.$editting,
    })}
`
