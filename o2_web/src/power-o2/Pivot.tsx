import { PivotWidget } from "./types"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement('template')
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

const DefaultTable = ({ children }: any) => (
  <table>{children}</table>
)

const Pivot = ({ meta, theme }: PivotWidget) => {
  const table = tableHtmlComponent(meta.html)
  const TableComponent = theme.table || DefaultTable
  return (
    <TableComponent>
      <thead dangerouslySetInnerHTML={{__html: table?.children[0]?.innerHTML}}></thead>
      <tbody dangerouslySetInnerHTML={{__html: table?.children[1]?.innerHTML}}></tbody>
    </TableComponent>
  )
}

export default Pivot
