import { BarGraph } from "playbook-ui"

type VerticalBarChartProps = {
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

const Default = ({ extraProps, ...props }) => {
  const allProps = { ...{ ...props, ...extraProps } }
  return <BarGraph {...allProps} />
}

export const VerticalBarChart = ({ meta: props, theme }: { meta: VerticalBarChartProps; theme: any }) => {
  const Component = theme?.verticalBarChart?.chart || Default
  return <Component {...props} />
}
