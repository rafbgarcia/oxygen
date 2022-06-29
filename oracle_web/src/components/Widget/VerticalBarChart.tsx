import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { useWidgetQuery } from "../../lib/codegenGraphql"
import { Title as PbTitle } from "playbook-ui"
import { ChartBarIcon } from "@heroicons/react/outline"
import isEmpty from "lodash/isEmpty"

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend)
ChartJS.register(BarElement)
ChartJS.register(LineElement, PointElement)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: false,
      text: "Chart title",
    },
  },
}

export const VerticalBarChart = ({ widget, dataset }) => {
  const { data, loading, error } = useWidgetQuery({
    variables: {
      type: widget.type,
      build: widget.buildInfo,
      dataset,
    },
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <p>Error {JSON.stringify(error)}</p>
  } else if (isEmpty(data?.widget?.datasets)) {
    return <Empty />
  }

  return <Bar options={{ ...options }} data={data.widget} />
}

const Empty = () => {
  return (
    <div className="flex items-center justify-center h-full border">
      <PbTitle>No data</PbTitle>
    </div>
  )
}

const Loading = () => {
  return (
    <div className="animate-pulse flex items-center justify-center">
      <ChartBarIcon className="h-96" />
    </div>
  )
}
