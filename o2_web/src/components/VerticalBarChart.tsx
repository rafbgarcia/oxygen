const Default = ({ children }: any) => <div>{children}</div>

export const VerticalBarChart = ({ meta, theme }: PivotWidget) => {
  const Component = theme.verticalBarChar || Default
  return <Component>Vertical bar hart</Component>
}
