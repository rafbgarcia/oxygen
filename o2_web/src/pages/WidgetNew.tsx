import { api } from "../lib/api"
import { Page } from "./Page"
import { PivotBuild } from "./WidgetNew/PivotBuild"
import { useForm } from "react-hook-form"
import { TextField } from "../components/TextField"
import { Wait } from "../components/Wait"
import { SelectField } from "../components/SelectField"
import { map } from "lodash-es"
import { Button } from "../components/Button"

const widgetMapping = {
  pivot_table: PivotBuild,
}

const widgetTypes = [
  { id: "indicator", name: "Indicator" },
  { id: "pivot_table", name: "Pivot" },
  { id: "line_chart", name: "Line Chart" },
  { id: "vertical_bar_chart", name: "Vertical Bar Chart" },
]

export const WidgetNew = () => {
  const defaultValues = { widget: "pivot_table", dataset: "", name: "" }
  const { register, handleSubmit, watch } = useForm({ defaultValues })
  const { data, error } = api.getDatasets()

  const Waiting = Wait(data, error)
  if (Waiting) return <Waiting />

  const dataset = watch("dataset")
  const widget = watch("widget")
  const BuildPage = widgetMapping[widget]
  const datasetCollection = map(data.datasets, ({ id, name }) => ({ value: id, label: name }))
  const widgetsCollection = map(widgetTypes, ({ id, name }) => ({ value: id, label: name }))

  return (
    <>
      <Page.Header $flex>
        <Page.Title>New Widget</Page.Title>
        <Button $primary loading={false}>
          Save
        </Button>
      </Page.Header>
      <Page.Main>
        <div className="p-4">
          <TextField
            autoFocus
            label="Name"
            className="mb-5"
            register={register("name", { required: true })}
          />
          <SelectField
            collection={datasetCollection}
            label="Dataset"
            className="mb-5"
            register={register("dataset", { required: true })}
          />
          <SelectField
            collection={widgetsCollection}
            label="Widget"
            className="mb-5"
            register={register("widget", { required: true })}
          />
        </div>

        {BuildPage && <BuildPage dataset={dataset} />}
      </Page.Main>
    </>
  )
}
