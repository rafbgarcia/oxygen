import { api } from "../lib/api"
import { Page } from "./Page"
import { PivotPreview } from "./WidgetNew/PivotPreview"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { map, find } from "lodash-es"
import { Button } from "../components/Button"
import { useImmerReducer } from "use-immer"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

const widgetMapping = {
  pivot_table: PivotPreview,
}

const widgetTypes = [
  { id: "indicator", name: "Indicator" },
  { id: "pivot_table", name: "Pivot" },
  { id: "line_chart", name: "Line Chart" },
  { id: "vertical_bar_chart", name: "Vertical Bar Chart" },
]

const initialState = {
  buildInfo: {
    rows: [] as any,
    columns: [] as any,
    values: [] as any,
  },
}

const actions = {
  removeField: (draft, { metadataKey, index }) => {
    draft.buildInfo[metadataKey].splice(index, 1)
  },
  addField: (draft, { metadataKey, field }) => {
    draft.buildInfo[metadataKey].push(field)
  },
}

const defaultValues = {
  type: "pivot_table",
  datasetId: "19",
  title: "",
}

export const WidgetNew = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [state, dispatch] = useImmerReducer(
    (draft, action) => {
      actions[action.type](draft, action)
    },
    { ...initialState }
  )
  const { register, getValues, watch } = useForm({ defaultValues })
  const { data, error } = api.getDatasets()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const widgetsCollection = map(widgetTypes, ({ id, name }) => ({ value: id, label: name }))
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
          <TextField
            autoFocus
            label="Name"
            className="w-80"
            register={register("title", { required: true })}
          />
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
      </Page.Main>
    </>
  )
}
