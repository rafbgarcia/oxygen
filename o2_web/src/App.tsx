import PowerO2 from "./package/power_o2"
import { Table, Title } from "playbook-ui"
import "../node_modules/playbook-ui/dist/playbook.css"

PowerO2.init({
  host: "http://127.0.0.1:8000",
})

const theme = {
  title: ({ children }) => <Title>{children}</Title>,
  // gridRow: ({ children }) => <section className="widget-group">{children}</section>,
  // lastUpdateAt: () => null,
  widgets: {
    pivot: {
      table: ({ children }: any) => <Table size="sm">{children}</Table>,
    },
  },
  filters: {
    // ...
  }
}

const App = () => {
  const dashboardId = 1
  const [Dashboard] = PowerO2.dashboard(dashboardId, { theme })

  return (
    <Dashboard />
  )
}

export default App
