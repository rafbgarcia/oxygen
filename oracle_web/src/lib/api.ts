import { useState } from "react"
import useSWR, { SWRResponse } from "swr"
import fetch from "unfetch"
import { Wait } from "../components/Wait"

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

const MUTATIONS = {
  createDashboard: (data) => {
    return post(path(`/dashboards/create`), data)
  },
  widgetPreview: (dashboardId, buildInfo) => {
    return post(path(`/dashboards/${dashboardId}/widgets/preview`), buildInfo)
  },
  widgetCreate: (dashboardId, data) => {
    return post(path(`/dashboards/${dashboardId}/widgets/create`), data)
  },
  createDataset: (data) => {
    return post(path(`/datasets/create`), data)
  },
  previewDataset: (data) => {
    return post(path(`/datasets/preview`), data)
  },
}
const QUERIES = {
  getDashboard: (id) => {
    return useSWR(path(`/dashboards/${id}`), fetcher)
  },
  getDashboards: () => {
    return useSWR(path(`/dashboards`), fetcher)
  },
  getDatasets: () => {
    return useSWR(path(`/datasets`), fetcher)
  },
}

export const api = {
  init: (config: Config) => {
    _config = { ..._config, ...config }
  },
  ...QUERIES,
  ...MUTATIONS,
}

type MutationKeys = keyof typeof MUTATIONS
type MutationTypes = typeof MUTATIONS[keyof typeof MUTATIONS]

export const useLoadingMutation = (action: MutationKeys): [(...arg: any[]) => Promise<any>, boolean] => {
  const [loading, setLoading] = useState(false)
  const fn = (...arg) => {
    setLoading(true)

    return new Promise((resolve, reject) => {
      const fn = MUTATIONS[action] as (...arg: any[]) => Promise<any>
      return fn(...arg)
        .then((arg: any) => {
          setLoading(false)
          resolve(arg)
        })
        .catch((error) => {
          setLoading(false)
          console.log(">>>", action, error)
          reject(error)
        })
    })
  }
  return [fn, loading]
}

type Queries = keyof typeof QUERIES

export const useWaitingQuery = (action: Queries, ...args) => {
  const fn = QUERIES[action] as (...any) => SWRResponse<any, any>
  const { data, error } = fn(...args)
  const Waiting = Wait(data, error)

  return { data, error, Waiting }
}
