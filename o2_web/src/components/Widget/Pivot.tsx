import { Table } from "playbook-ui"
import { useWidgetQuery } from "../../lib/codegenGraphql"
import { times } from "lodash-es"
import "./Pivot.css"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement("template")
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

export const Pivot = ({ widget, dataset }) => {
  const { data, loading, error } = useWidgetQuery({
    variables: {
      type: widget.type,
      build: widget.buildInfo,
      dataset,
    },
  })

  if (loading) {
    return <Loading />
  } else if (!data || error) {
    return <p>Error {JSON.stringify(error)}</p>
  }

  const table = tableHtmlComponent(data.widget.html)
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

const Loading = () => {
  const cols = 4
  const rows = 20
  return (
    <div className="animate-pulse">
      <Table>
        <thead>
          <tr>
            {times(cols, () => (
              <th>
                <div className="h-4 bg-slate-300 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times(rows, () => (
            <tr>
              {times(cols, () => (
                <td>
                  <div className="h-8 bg-slate-300 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
