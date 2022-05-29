import { useParams } from "react-router-dom"
import { Wait } from "../components/Wait"
import { api } from "../lib/api"
import { filter, map } from "lodash-es"
import { Widget } from "../components/Widget"
import { Title } from "playbook-ui"

const Row = ({ widgets }) => {
  return (
    <div className="flex items-start justify-evenly gap-x-2 mb-10 overflow-hidden">
      {map(widgets, (widget) => (
        <div key={widget.id} className="w-full bg-white p-2 h-[400px] overflow-auto">
          <h5 className="font-medium text-lg">{widget.title}</h5>
          <Widget type={widget.type} meta={{ ...widget.meta, height: 400 }} theme={{}} />
        </div>
      ))}
    </div>
  )
}

export const EmbeddedDashboard = () => {
  const { id } = useParams()
  const { data, error } = api.getDashboard(id)

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return (
    <>
      <header className="p-4 mb-10">
        <Title>{data.dashboard.name}</Title>
      </header>
      <main>
        {data.rows.map((row) => (
          <Row key={row.id} widgets={filter(data.widgets, { dashboardRow: row.id })} />
        ))}
      </main>
    </>
  )
}
