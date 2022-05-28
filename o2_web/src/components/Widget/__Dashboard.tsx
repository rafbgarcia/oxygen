import { Pivot } from "./Pivot"

type DashboardProps = {
  data: DashboardJSON | undefined
  theme: DashboardTheme
}

const widgetMap = {
  pivot: Pivot,
  vertical_bar_chart: Pivot,
}

const DefaultTitle: ComponentTheme = ({ children }) => <h3>{children}</h3>

const Dashboard = ({ data, theme }: DashboardProps) => {
  if (!data) return <h3>No data</h3>
  const TitleComponent = theme.title || DefaultTitle

  return (
    <>
      <TitleComponent>{data.title}</TitleComponent>

      {data.gridRows.map((row) => {
        return row.widgets.map((widget) => {
          const Widget = widgetMap[widget.type]
          return <Widget key={widget.id} meta={widget.meta} theme={theme?.widgets?.pivot || {}} />
        })
      })}
    </>
  )
}

export default Dashboard
