import { Pivot } from "./Pivot"
import { VerticalBarChart } from "./VerticalBarChart"

type PreviewMapping = Record<WidgetType, any>
type Props = Widget & { type: WidgetType }

const WIDGETS: PreviewMapping = {
  pivot_table: Pivot,
  vertical_bar_chart: VerticalBarChart,
}

export const Widget = ({ type, meta, theme }: Props) => {
  if (!meta) {
    return <></>
  }

  const Component = WIDGETS[type]

  return <Component meta={meta} theme={theme} />
}
