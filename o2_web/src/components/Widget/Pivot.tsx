import { Table } from "playbook-ui"
import "./Pivot.css"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement("template")
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

export const Pivot = ({ meta }) => {
  if (!meta?.html) {
    return null
  }
  const table = tableHtmlComponent(meta.html)
  const theadHTML = table?.children[0]?.innerHTML
  const tbodyHTML = table?.children[1]?.innerHTML
    .replace(/\<td/g, "<td class='data-cell'")
    .replace(/\<th/g, "<td class='header-cell'")

  return (
    <Table sticky dataTable className="o2-default-pivot-widget">
      <thead dangerouslySetInnerHTML={{ __html: theadHTML }}></thead>
      <tbody dangerouslySetInnerHTML={{ __html: tbodyHTML }}></tbody>
    </Table>
  )
}
