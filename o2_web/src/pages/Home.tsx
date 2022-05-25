import Dashboard from '../components/Dashboard'
import * as o2 from '../lib/o2'

const theme: DashboardTheme = {
  // title: ({ children }) => <Title>{children}</Title>,
  // gridRow: ({ children }) => <section className="widget-group">{children}</section>,
  // lastUpdateAt: () => null,
  widgets: {
    pivot: {
      // table: ({ children }: any) => <Table size="sm">{children}</Table>,
    },
  },
  // filters: {
  //   // ...
  // }
}

export const Home = () => {
  const { data, error } = o2.getDashboard(1)

  if (error) return <p>Error: {error}</p>

  return <Dashboard data={data} theme={theme} />
}
