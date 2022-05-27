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

const post = (url, data) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json())

export const api = {
  init: (config: Config) => {
    _config = { ..._config, ...config }
  },
  getDashboard: (id) => {
    return useSWR(path(`/dashboards/${id}`), fetcher)
  },
  getDashboards: () => {
    return useSWR(path(`/dashboards`), fetcher)
  },
  createDashboard: (data) => {
    return post(path(`/dashboards/create`), data)
  },
  getWidget: (widgetId: number) => {
    return useSWR(path(`/widgets/${widgetId}`), fetcher)
  },
  widgetPreview: (buildInfo) => {
    return post(path(`/widgets/preview`), buildInfo)
  },
  getDatasets: () => {
    return useSWR(path(`/datasets`), fetcher)
  },
  createDataset: (data) => {
    return post(path(`/datasets/create`), data)
  },
  previewDataset: (data) => {
    return post(path(`/datasets/preview`), data)
  },
}
