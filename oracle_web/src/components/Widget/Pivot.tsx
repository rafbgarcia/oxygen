import { Table, Title } from "playbook-ui"
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
  } else if (error) {
    return <p>Error {JSON.stringify(error)}</p>
  } else if (!data?.widget) {
    return <Empty />
  }

  const table = tableHtmlComponent(data.widget.html)
  const theadHTML = table?.children[0]?.innerHTML
  const tbodyHTML = table?.children[1]?.innerHTML
    .replace(/\<td/g, "<td class='data-cell'")
    .replace(/\<th/g, "<td class='header-cell'")

  return (
    <Table sticky dataTable className="oracle-default-pivot-widget">
      <thead dangerouslySetInnerHTML={{ __html: theadHTML }}></thead>
      <tbody dangerouslySetInnerHTML={{ __html: tbodyHTML }}></tbody>
    </Table>
  )
}

const Empty = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Title>No data</Title>
    </div>
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
            {times(cols, (i) => (
              <th key={i}>
                <div className="h-4 bg-slate-300 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times(rows, (i) => (
            <tr key={i}>
              {times(cols, (j) => (
                <td key={j}>
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
