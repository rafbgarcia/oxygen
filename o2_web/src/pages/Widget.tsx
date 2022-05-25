import { PowerO2 } from "../power-o2"
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart'

export const Widget = () => {
  const dashboardId = 1
  const [Dashboard, error] = PowerO2.dashboard(dashboardId, { theme })

  if (error) return <p>Error: {error}</p>

  return (
    <div className="flex">
      <div className="flex flex-col w-96 h-screen px-4 py-8 overflow-y-auto bg-gray-50">
        <div className="border-b border-gray-200 pb-3 mb-3">
          <PivotTableChartIcon />
          Pivot
        </div>

        <div>
          <p>Rows</p>
          <select>
            <option>a</option>
          </select>
        </div>
      </div>
      <div className="w-full h-full min-h-screen px-4 py-8 overflow-y-auto overflow-x-auto shadow-md">
        <Dashboard />
      </div>
      <div className="flex flex-col w-96 h-screen px-4 py-8 overflow-y-auto border-l">
        // Widget View Options
      </div>
    </div>
  )
}
