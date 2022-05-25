import { DashboardJSON, ComponentTheme, DashboardTheme } from "./types"
import Pivot from "./Pivot"

type DashboardProps = {
  dashboard: DashboardJSON
  theme: DashboardTheme
}

const widgetMap = {
  "pivot": Pivot,
  "vertical_bar_chart": Pivot,
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
          return <Widget key={widget.id} meta={widget.meta} theme={theme?.widgets?.pivot || {}} />
        })
      })}
    </>
  )
}

export default Dashboard
