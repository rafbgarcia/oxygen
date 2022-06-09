import { Table } from "playbook-ui"
import { useWidgetQuery } from "../../lib/codegenGraphql"
import "./Pivot.css"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement("template")
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

export const Pivot = ({ widget, dataset }) => {
  const { data, loading } = useWidgetQuery({
    variables: {
      type: widget.type,
      build: widget.buildInfo,
      dataset,
    },
  })

  if (loading) {
    return "Loading..."
  }

  const table = tableHtmlComponent(data?.widget.html)
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
