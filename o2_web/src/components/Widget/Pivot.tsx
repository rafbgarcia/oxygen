import { Table } from "playbook-ui"
import "./Pivot.css"

interface PivotWidget extends Widget {
  meta?: {
    html: string
  }
  theme?: {
    table?: ComponentTheme
  }
}

const tableHtmlComponent = (content: string) => {
  let template = document.createElement("template")
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

const DefaultTable = ({ children }: any) => (
  <Table sticky dataTable className="o2-default-pivot-widget">
    {children}
  </Table>
)

export const Pivot = ({ meta, theme }: PivotWidget) => {
  if (!meta?.html) {
    return <></>
  }
  const table = tableHtmlComponent(meta.html)
  const theadHTML = table?.children[0]?.innerHTML
  const tbodyHTML = table?.children[1]?.innerHTML
    .replace(/\<td/g, "<td class='data-cell'")
    .replace(/\<th/g, "<td class='header-cell'")
  const TableComponent = theme?.table || DefaultTable
  return (
    <TableComponent>
      <thead dangerouslySetInnerHTML={{ __html: theadHTML }}></thead>
      <tbody dangerouslySetInnerHTML={{ __html: tbodyHTML }}></tbody>
    </TableComponent>
  )
}
