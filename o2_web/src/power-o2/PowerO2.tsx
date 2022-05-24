import { useState } from "react"
import Dashboard from "./Dashboard"
import { DashboardTheme, WidgetType } from "./types"

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

const powerO2: PowerO2 = {
  config: {
    host: "http://127.0.0.1:8000",
  },

  init: (config) => {
    powerO2.config = { ...powerO2.config, ...config }
  },

  dashboard: (dashboardId: number, { theme }: DashboardOptions) => {
    // http://localhost:8000/o2/fetch

    const json = {
      "dashboard": {
        "title": "My Dashboard",
        "dataLastUpdatedAt": "2022-05-24 13:40:10",
        "gridRows": [
          {
            widgets: [
              {
                "id": 1,
                "type": "pivot" as WidgetType,
                "meta": {
                  "html": `<table>    <thead>      <tr>        <th></th>        <th>follow_up_number</th>        <th colspan="2" halign="left">1</th>        <th colspan="2" halign="left">2</th>      </tr>      <tr>        <th></th>        <th></th>        <th>#</th>        <th>total</th>        <th>#</th>        <th>total</th>      </tr>      <tr>        <th>resulted_by</th>        <th>follow_up_result</th>        <th></th>        <th></th>        <th></th>        <th></th>      </tr>    </thead>    <tbody>      <tr>        <th>Accavallo, Tony</th>        <th>power_not_interested</th>        <td>0.0</td>        <td>0.00</td>        <td>4.0</td>        <td>0.07</td>      </tr>      <tr>        <th>Alberto, Joseph</th>        <th>power_not_interested</th>        <td>0.0</td>        <td>0.00</td>        <td>7.0</td>        <td>0.06</td>      </tr>      <tr>        <th>Angelo, Justin</th>        <th>candidate_not_interested</th>        <td>0.0</td>        <td>0.00</td>        <td>1.0</td>        <td>0.03</td>      </tr>      <tr>        <th>Asch, Jesse</th>        <th>power_not_interested</th>        <td>0.0</td>        <td>0.00</td>        <td>13.0</td>        <td>0.62</td>      </tr>      <tr>        <th>Balsamo, Vinny</th>        <th>power_not_interested</th>        <td>0.0</td>        <td>0.00</td>        <td>5.0</td>        <td>0.15</td>      </tr>      <tr>        <th rowspan="6" valign="top">Banner, Gia</th>        <th>answering_machine_left_via_voicemail</th>        <td>1359.0</td>        <td>0.22</td>        <td>801.0</td>        <td>0.19</td>      </tr>      <tr>        <th>callback</th>        <td>166.0</td>        <td>0.03</td>        <td>116.0</td>        <td>0.03</td>      </tr>      <tr>        <th>candidate_not_interested</th>        <td>164.0</td>        <td>0.03</td>        <td>82.0</td>        <td>0.02</td>      </tr>      <tr>        <th>interview_scheduled</th>        <td>89.0</td>        <td>0.01</td>        <td>103.0</td>        <td>0.02</td>      </tr>      <tr>        <th>no_answer</th>        <td>275.0</td>        <td>0.04</td>        <td>121.0</td>        <td>0.03</td>      </tr>      <tr>        <th>power_not_interested</th>        <td>516.0</td>        <td>0.08</td>        <td>210.0</td>        <td>0.05</td>      </tr>    </tbody>  </table>`
                }
              }
            ]
          },
        ]
      }
    }

    const Component = () => <Dashboard dashboard={json.dashboard} theme={theme} />
    return [Component]
  }
}

export default powerO2
