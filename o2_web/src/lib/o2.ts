import useSWR from 'swr'
import fetch from 'unfetch'

type Config = {
  host: string
}

let _config = {
  host: 'http://127.0.0.1:8000',
}

const fetcher = (resource: string) => fetch(resource).then((res) => res.json())

const path = (to: string) => _config.host + to

export const init = (config: Config) => {
  _config = { ..._config, ...config }
}

export const getDashboard = (dashboardId: number) => {
  return useSWR<DashboardJSON>(path(`/dashboards/${dashboardId}`), fetcher)
}

export const getWidget = (widgetId: number) => {
  return useSWR(path(`/widgets/${widgetId}`), fetcher)
}
