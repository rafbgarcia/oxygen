import { useEffect } from "react"
import { useParams } from "react-router-dom"
import GridLayout, { WidthProvider } from "react-grid-layout"
import { Wait } from "../components/Wait"
import { useDashboardQuery } from "../lib/codegenGraphql"
import { Widget } from "../components/Widget"

import "./iframeResizer"

const GridLayoutAutoWidth = WidthProvider(GridLayout)

export const EmbeddedDashboard = () => {
  const { dashboardId } = useParams()
  const { data, error, refetch } = useDashboardQuery({ variables: { id: dashboardId! } })

  useEffect(() => {
    const refetchQuery = () => refetch()
    window.addEventListener("focus", refetchQuery)
    return () => window.removeEventListener("focus", refetchQuery)
  })

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return <Dashboard dashboard={data!.dashboard} />
}

const Dashboard = ({ dashboard }) => {
  return (
    <section>
      <GridLayoutAutoWidth
        layout={dashboard.layout}
        isDraggable={false}
        isResizable={false}
        cols={12}
        rowHeight={10}
        compactType={"vertical"}
        measureBeforeMount={true}
        autoSize
      >
        {dashboard.widgets.map((widget) => {
          return (
            <div key={widget.id} className="relative">
              <div className="h-full overflow-auto">
                <Widget type={widget.type} renderData={widget.renderData || {}} />
              </div>
            </div>
          )
        })}
      </GridLayoutAutoWidth>
    </section>
  )
}
