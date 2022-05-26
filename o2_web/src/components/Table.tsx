import { tw } from "../lib/tw"
import "./Table.css"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement("template")
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

export const Table = tw.table`w-full text-sm table-auto border-collapse text-left`
Table.td = tw.td`p-2 border-b`
Table.th = tw.td`p-2 border-b`

Table.HTMLBody = ({ html }) => {
  const table = tableHtmlComponent(html)

  return (
    <>
      <thead
        className="o2-html-table-thead"
        dangerouslySetInnerHTML={{ __html: table?.children[0]?.innerHTML }}
      ></thead>
      <tbody
        className="o2-html-table-tbody"
        dangerouslySetInnerHTML={{ __html: table?.children[1]?.innerHTML }}
      ></tbody>
    </>
  )
}
