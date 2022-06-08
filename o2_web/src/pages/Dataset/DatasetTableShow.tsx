import { Title } from "playbook-ui"
import { useOutletContext, useParams } from "react-router-dom"
import { Dataset } from "../../lib/codegenGraphql"
import { find } from "lodash-es"
import { Table } from "../../components/Table"

export const DatasetTableShow = () => {
  const { tableId } = useParams()
  const { dataset } = useOutletContext<{ dataset: Dataset }>()
  const table = find(dataset.tables, { id: tableId })

  return (
    <>
      <div className="mb-4">
        <Title size={3}>{table.title}</Title>
      </div>
      <Table>
        <Table.HTMLBody html={table.htmlPreview} />
      </Table>
    </>
  )
}
