import fetch from 'unfetch'

import { useState } from "react"
import Dashboard from "./Dashboard"
import { DashboardJSON, DashboardTheme, WidgetType } from "./types"
import useSWR from 'swr'

type Config = {
  host: string,
}

type PowerO2 = {
  config: Config,
  dashboard: any,
  init: (config: Config) => void,
}

type DashboardOptions = {
  theme: DashboardTheme
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

const path = (to: string) => powerO2.config.host + to

const powerO2: PowerO2 = {
  config: {
    host: "http://127.0.0.1:8000",
  },

  init: (config) => {
    powerO2.config = { ...powerO2.config, ...config }
  },

  dashboard: (dashboardId: number, { theme }: DashboardOptions) => {
    const { data: dashboard, error } = useSWR<DashboardJSON>(path(`/dashboards/${dashboardId}`), fetcher)
    const Component = dashboard ? () => <Dashboard dashboard={dashboard} theme={theme} /> : () => "Loading..."

    return [Component, error]
  }
}

export default powerO2
