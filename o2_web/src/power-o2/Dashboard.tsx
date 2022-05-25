import { DashboardJSON, ComponentTheme, DashboardTheme, Widget, WidgetType } from "./types"
import Pivot from "./Pivot"

type WidgetMap = {
  [key in WidgetType]: ({}: Widget) => JSX.Element
}

type DashboardProps = {
  dashboard: DashboardJSON
  theme: DashboardTheme
}

const widgetMap: WidgetMap = {
  "pivot": Pivot,
  "column_barchart": Pivot,
}

const DefaultTitle: ComponentTheme = ({ children }) => <h3>{children}</h3>

const Dashboard = ({ dashboard, theme }: DashboardProps) => {
  const TitleComponent = theme.title || DefaultTitle

  return (
    <>
      <TitleComponent>{dashboard.title}</TitleComponent>

      {dashboard.gridRows.map(row => {
        return row.widgets.map(widget => {
          const Widget = widgetMap[widget.type]
          return <Widget key={widget.id} meta={widget.meta} theme={theme.widgets.pivot} />
        })
      })}
    </>
  )
}

export default Dashboard
