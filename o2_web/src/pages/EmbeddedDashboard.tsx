import { useParams } from "react-router-dom"
import { Wait } from "../components/Wait"
import { Dashboard } from "../components/Dashboard"
import { api } from "../lib/api"
import "./iframeResizer"

export const EmbeddedDashboard = () => {
  const { id } = useParams()
  const { data, error } = api.getDashboard(id)

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  return <Dashboard data={data} />
}
