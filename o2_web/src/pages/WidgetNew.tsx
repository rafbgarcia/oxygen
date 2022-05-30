import { useState } from "react"
import { map, find } from "lodash-es"
import { useForm } from "react-hook-form"
import { api, useMutation, useQuery } from "../lib/api"
import { Page } from "./Page"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { Button } from "../components/Button"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { WidgetPreview } from "./WidgetNew/WidgetPreview"

const widgetsCollection: Array<{ value: WidgetType; label: string }> = [
  { value: "pivot_table", label: "Pivot" },
  { value: "vertical_bar_chart", label: "Vertical Bar Chart" },
]

const defaultValues = {
  title: "",
  type: "pivot_table" as WidgetType,
  buildInfo: {},
}

export const WidgetNew = () => {
  const navigate = useNavigate()
  const { dashboardId } = useParams()
  const { dataset } = useLocation().state as { dataset: Dataset }
  const { register, getValues, setValue, watch } = useForm({ defaultValues })
  const [createWidget, saving] = useMutation("widgetCreate")
  const handleSave = () => {
    createWidget(dashboardId, getValues()).then(() => navigate(`/dashboards/${dashboardId}/edit`))
  }
  const handleChangeBuildInfo = (state) => {
    setValue("buildInfo", state.buildInfo)
  }
  const widgetType = watch("type")

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
