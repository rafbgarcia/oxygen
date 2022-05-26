import useSWR from "swr"
import fetch from "unfetch"

type Config = {
  host: string
}

let _config = {
  host: "http://127.0.0.1:8000",
}

const fetcher = (resource: string) => fetch(resource).then((res) => res.json())

const path = (to: string) => _config.host + to

export const api = {
  init: (config: Config) => {
    _config = { ..._config, ...config }
  },
  getDashboard: (dashboardId: number) => {
    return useSWR<DashboardJSON>(path(`/dashboards/${dashboardId}`), fetcher)
  },
  getWidget: (widgetId: number) => {
    return useSWR(path(`/widgets/${widgetId}`), fetcher)
  },
  createDataset: (data) => {
    return fetch(path(`/datasets/create`), {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
  },
  previewDataset: (data) => {
    return fetch(path(`/datasets/preview`), {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
  },
}
