import { BarGraph } from "playbook-ui"

type Meta = {
  axisTitle: string
  dark?: Boolean
  xAxisCategories: Array<string>
  yAxisMin: number
  yAxisMax: number
  chartData: Array<{
    name: string
    data: Array<number>
  }>
  className?: string
  id: number
  pointStart: number
  subTitle?: string
  title: string
  type?: string
  legend?: boolean
  toggleLegendClick?: boolean
  height?: string
  colors: Array<string>
}

interface VerticalBarChartWidget extends Widget {
  meta?: Meta
  theme?: {
    chart?: ComponentTheme
  }
}

const Default = ({ ...props }) => {
  return <BarGraph {...props} />
}

export const VerticalBarChart = ({ meta: props, theme }: VerticalBarChartWidget) => {
  const Component = theme?.chart || Default
  const height = props?.height || 400

  return (
    <div className={`overflow-hidden h-[${height}px]`}>
      <Component {...props} />
    </div>
  )
}
