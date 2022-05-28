import { useState } from "react"
import { map, find } from "lodash-es"
import { useForm } from "react-hook-form"
import { api } from "../lib/api"
import { Page } from "./Page"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { Button } from "../components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { WidgetPreview } from "./WidgetNew/WidgetPreview"

const widgetsCollection: Array<{ value: WidgetType; label: string }> = [
  { value: "pivot_table", label: "Pivot" },
  { value: "vertical_bar_chart", label: "Vertical Bar Chart" },
]

const _defaultValuesForTesting_RemoveThisLater = {
  title: "",
  datasetId: "19",
  type: "vertical_bar_chart",
  buildInfo: {},
}

export const WidgetNew = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: _defaultValuesForTesting_RemoveThisLater,
  })
  const { data, error } = api.getDatasets()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const dataset = find(data.datasets, { id: parseInt(watch("datasetId")) })
  const widgetType = watch("type")

  const handleSave = () => {
    setSaving(true)
    api
      .widgetCreate(getValues())
      .then(() => {
        navigate(`/dashboards/${params.dashboardId}/edit`)
        setSaving(false)
      })
      .catch((err) => {
        console.log(err)
        setSaving(false)
      })
  }

  const handleChangeBuildInfo = (buildInfo) => {
    setValue("buildInfo", buildInfo)
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

        <WidgetPreview
          key={widgetType}
          type={widgetType as WidgetType}
          dataset={dataset}
          onChange={handleChangeBuildInfo}
        />
      </Page.Main>
    </>
  )
}
