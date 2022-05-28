import { api } from "../lib/api"
import { Page } from "./Page"
import { PivotBuild } from "./WidgetNew/PivotBuild"
import { VerticalBarChartBuild } from "./WidgetNew/VerticalBarChartBuild"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { map, find } from "lodash-es"
import { Button } from "../components/Button"
import { useImmerReducer } from "use-immer"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

const widgetMapping: Record<WidgetType, any> = {
  pivot_table: PivotBuild,
  vertical_bar_chart: VerticalBarChartBuild,
}

const widgetsCollection: Array<{ value: WidgetType; label: string }> = [
  { value: "pivot_table", label: "Pivot" },
  { value: "vertical_bar_chart", label: "Column Chart" },
]

const actions = {
  initBuildInfo: (draft, { buildInfo }) => {
    draft.buildInfo = buildInfo
  },
  removeField: (draft, { metadataKey, index }) => {
    draft.buildInfo[metadataKey].splice(index, 1)
  },
  addField: (draft, { metadataKey, field }) => {
    draft.buildInfo[metadataKey].push(field)
  },
}

const _defaultValuesForTesting_RemoveThisLater = {
  title: "My Column Chart",
  datasetId: "19",
  type: "pivot_table",
}

const initialState = {
  buildInfo: {},
  // designInfo: {},
}

export const WidgetNew = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [state, dispatch] = useImmerReducer((draft, { action, ...payload }) => {
    actions[action](draft, payload)
  }, initialState)
  const { register, getValues, watch } = useForm({ defaultValues: _defaultValuesForTesting_RemoveThisLater })
  const { data, error } = api.getDatasets()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const dataset = find(data.datasets, { id: parseInt(watch("datasetId")) })
  const widgetType = watch("type")
  const BuildPage = widgetMapping[widgetType]

  const handleSave = () => {
    const data = { ...getValues(), ...state }
    setSaving(true)
    api
      .widgetCreate(data)
      .then(() => {
        navigate(`/dashboards/${params.dashboardId}/edit`)
        setSaving(false)
      })
      .catch((err) => {
        console.log(err)
        setSaving(false)
      })
  }

  return (
    <>
      <Page.Header $flex>
        <Page.Title>New Widget</Page.Title>
        <Button $primary loading={saving} onClick={handleSave}>
          Save
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="p-4 flex items-center justify-start gap-x-4">
          <TextField autoFocus label="Title" className="w-80" register={register("title")} />
          <SelectField
            collection={datasetCollection}
            allowBlank
            label="Dataset"
            className="w-80"
            register={register("datasetId", { required: true })}
          />
          <SelectField
            collection={widgetsCollection}
            label="Widget"
            className="w-80"
            register={register("type", { required: true })}
          />
        </div>

        {dataset && BuildPage && <BuildPage state={state} dispatch={dispatch} dataset={dataset} />}
        {/* <WidgetBuild type={widgetType} onChange={setValue} /> */}
      </Page.Main>
    </>
  )
}
