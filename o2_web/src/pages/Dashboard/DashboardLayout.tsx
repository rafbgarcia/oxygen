import { Widget } from "../../components/Widget"
import { Title } from "playbook-ui"
import GridLayout, { WidthProvider } from "react-grid-layout"
import { PencilAltIcon } from "@heroicons/react/outline"
import { useNavigate, useParams } from "react-router-dom"

// Auto height: https://github.com/ctrlplusb/react-sizeme
const GridLayoutAutoWidth = WidthProvider(GridLayout)

export const DashboardLayout = ({ dashboard }) => {
  const handleLayoutChange = (layout) => {
    // console.log(layout)
  }

  return (
    <section>
      <header className="p-4 mb-10">
        <Title>{dashboard.name}</Title>
      </header>

      <GridLayoutAutoWidth
        className="layout"
        cols={12}
        rowHeight={30}
        autoSize
        onLayoutChange={handleLayoutChange}
      >
        {dashboard.widgets.map((widget) => (
          <figure key={widget.id} data-grid={widget.layout} className="bg-gray-200 relative group">
            <WidgetActions widgetId={widget.id} />
            <WidgetTitle title={widget.title} />

            <Widget type={widget.type} meta={widget.meta} theme={{}} />
          </figure>
        ))}
      </GridLayoutAutoWidth>
    </section>
  )
}

const WidgetTitle = ({ title }) => {
  if (!title) return null

  return (
    <figcaption>
      <Title size={3} className="font-medium text-lg">
        {title}
      </Title>
    </figcaption>
  )
}

const WidgetActions = ({ widgetId }) => {
  const { dashboardId } = useParams()
  const navigate = useNavigate()
  const didClickEdit = () => navigate(`/dashboards/${dashboardId}/widgets/${widgetId}/edit`)

  return (
    <div className="absolute top-0 left-0 w-full px-2 py-1 text-right hidden group-hover:block">
      <a className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={didClickEdit}>
        <PencilAltIcon className="w-6 inline-block" />
      </a>
    </div>
  )
}
