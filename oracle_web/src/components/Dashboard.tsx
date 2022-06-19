import { filter, map } from "lodash-es"
import { Widget } from "./Widget"
import { Title } from "playbook-ui"

const Row = ({ row, widgets }) => {
  const heightClass = `h-[${row.height}px]`

  return (
    <div className="flex items-start justify-evenly gap-x-4 overflow-hidden w-full">
      {map(widgets, (widget) => (
        <div key={widget.id} className={`${heightClass} w-full p-2 overflow-auto`}>
          <h5 className="font-medium text-lg">{widget.title}</h5>
          <Widget type={widget.type} meta={{ ...widget.meta, height: row.height }} theme={{}} />
        </div>
      ))}
    </div>
  )
}
export const Dashboard = ({ data }) => {
  return (
    <>
      <header className="p-4 mb-10">
        <Title>{data.dashboard.name}</Title>
      </header>
      <main className="flex flex-col items-start gap-y-4">
        {/* {data.rows.map((row) => (
          <Row key={row.id} row={{ height: 400 }} widgets={filter(data.widgets, { dashboardRow: row.id })} />
        ))} */}
      </main>
    </>
  )
}
