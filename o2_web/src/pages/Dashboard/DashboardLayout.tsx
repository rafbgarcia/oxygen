import { Widget } from "../../components/Widget"
import { Title } from "playbook-ui"
import GridLayout, { WidthProvider } from "react-grid-layout"

// Auto height: https://github.com/ctrlplusb/react-sizeme
const GridLayoutAutoWidth = WidthProvider(GridLayout)

export const DashboardLayout = ({ dashboard }) => {
  const handleLayoutChange = (layout) => {
    // console.log(layout)
  }

  return (
    <>
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
          <figure key={widget.id} data-grid={widget.layout} className="bg-gray-200">
            <WidgetTitle title={widget.title} />

            <Widget type={widget.type} meta={widget.meta} theme={{}} />
          </figure>
        ))}
      </GridLayoutAutoWidth>
    </>
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
