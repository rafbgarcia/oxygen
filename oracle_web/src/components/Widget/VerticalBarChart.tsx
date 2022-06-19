import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { LineElement, PointElement } from "chart.js"
import { Bar, Line } from "react-chartjs-2"

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

export const VerticalBarChart = ({ meta }) => {
  return <Bar options={{ ...options, ...meta.options }} data={meta} />
}
