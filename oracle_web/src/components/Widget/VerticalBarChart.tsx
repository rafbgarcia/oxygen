import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { LineElement, PointElement } from "chart.js"
import { Bar, Line } from "react-chartjs-2"
import { useWidgetQuery } from "../../lib/codegenGraphql"
import { Title as PbTitle } from "playbook-ui"
import { ChartBarIcon } from "@heroicons/react/outline"

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
  } else if (!data?.widget) {
    return <Empty />
  }

  return <Bar options={{ ...options, ...meta.options }} data={meta} />
}

const Empty = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <PbTitle>No data</PbTitle>
    </div>
  )
}

const Loading = () => {
  return (
    <div className="animate-pulse">
      <ChartBarIcon />
    </div>
  )
}
