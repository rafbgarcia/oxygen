import { Widget } from "../../components/Widget"
import { Title } from "playbook-ui"
import GridLayout, { WidthProvider } from "react-grid-layout"
import { PencilAltIcon } from "@heroicons/react/outline"
import { useNavigate, useParams } from "react-router-dom"
import type { DashboardQuery } from "../../lib/codegenGraphql"
import { classnames } from "../../lib/classnames"

// Auto height: https://github.com/ctrlplusb/react-sizeme
const GridLayoutAutoWidth = WidthProvider(GridLayout)

export const DashboardLayout = ({
  dashboard,
  activeWidgetId,
}: {
  dashboard: DashboardQuery["dashboard"]
  activeWidgetId: string | undefined
}) => {
  const handleLayoutChange = (layout) => {
    // console.log(layout)
  }

  return (
    <section>
      <header className="p-4">
        <Title>{dashboard.name}</Title>
      </header>

      <GridLayoutAutoWidth
        className="layout"
        cols={12}
        rowHeight={10}
        autoSize
        onLayoutChange={handleLayoutChange}
      >
        {dashboard.widgets.map((widget) => {
          const widgetContainerClasses = classnames("relative group h-full overflow-auto", {
            "border-dashed border-2 border-gray-300": !widget.renderData && widget.id != activeWidgetId,
            "ring-2": widget.id == activeWidgetId,
          })
          return (
            <div key={widget.id} data-grid={widget.layout}>
              <figure className={widgetContainerClasses}>
                <WidgetActions widgetId={widget.id} />
                <Widget type={widget.type} renderData={widget.renderData || {}} theme={{}} />
              </figure>
            </div>
          )
        })}
      </GridLayoutAutoWidth>
    </section>
  )
}

const WidgetActions = ({ widgetId }) => {
  const { dashboardId } = useParams()
  const navigate = useNavigate()
  const didClickEdit = () => navigate(`/dashboards/${dashboardId}/widgets/${widgetId}/edit`)

  return (
    <div className="absolute top-0 left-0 w-full px-2 py-1 text-right hidden group-hover:block z-10">
      <a className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={didClickEdit}>
        <PencilAltIcon className="w-6 inline-block" />
      </a>
    </div>
  )
}
