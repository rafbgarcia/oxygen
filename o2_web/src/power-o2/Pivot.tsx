import { Table, TableBody, TableHead } from "@mui/material"

const tableHtmlComponent = (content: string) => {
  let template = document.createElement('template')
  template.innerHTML = content.trim()
  return template.content.firstChild as Element
}

const DefaultTable = ({ children }: any) => (
  <Table>{children}</Table>
)

const Pivot = ({ meta, theme }: PivotWidget) => {
  const table = tableHtmlComponent(meta.html)
  const TableComponent = theme.table || DefaultTable
  return (
    <TableComponent>
      <TableHead dangerouslySetInnerHTML={{__html: table?.children[0]?.innerHTML}}></TableHead>
      <TableBody dangerouslySetInnerHTML={{__html: table?.children[1]?.innerHTML}}></TableBody>
    </TableComponent>
  )
}

export default Pivot
