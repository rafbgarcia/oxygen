import { api } from "../lib/api"
import { Page } from "./Page"
import { PivotPreview } from "./WidgetNew/PivotPreview"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { map, find } from "lodash-es"
import { Button } from "../components/Button"

const widgetMapping = {
  pivot_table: PivotPreview,
}

const widgetTypes = [
  { id: "indicator", name: "Indicator" },
  { id: "pivot_table", name: "Pivot" },
  { id: "line_chart", name: "Line Chart" },
  { id: "vertical_bar_chart", name: "Vertical Bar Chart" },
]

const defaultValues = {
  widget: "pivot_table",
  datasetId: "19",
  name: "",
}

export const WidgetNew = () => {
  const { register, handleSubmit, watch } = useForm({ defaultValues })
  const { data, error } = api.getDatasets()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const widgetsCollection = map(widgetTypes, ({ id, name }) => ({ value: id, label: name }))
  const dataset = find(data.datasets, { id: parseInt(watch("datasetId")) })
  const widget = watch("widget")
  const BuildPage = widgetMapping[widget]

  return (
    <>
      <Page.Header $flex>
        <Page.Title>New Widget</Page.Title>
        <Button $primary loading={false}>
          Save
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="p-4 flex items-center justify-start gap-x-4">
          <TextField
            autoFocus
            label="Name"
            className="w-80"
            register={register("name", { required: true })}
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
            register={register("widget", { required: true })}
          />
        </div>

        {dataset && BuildPage && <BuildPage dataset={dataset} />}
      </Page.Main>
    </>
  )
}
