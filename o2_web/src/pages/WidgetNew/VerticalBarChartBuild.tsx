import { api } from "../../lib/api"
import { Pivot } from "../../components/Pivot"
import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Modal } from "../../components/Modal"
import { Button } from "../../components/Button"
import { isEmpty, map, partial, flow, every } from "lodash-es"
import { TextField } from "../../components/TextField"
import { SelectField } from "../../components/SelectField"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { componentDidMount } from "./helpers"

const FUNCTIONS = ["COUNT", "COUNT DISTINCT", "SUM"]

const TYPE: WidgetType = "vertical_bar_chart"
const BUILD_INFO = { categories: [], values: [], breakby: [] }

export const VerticalBarChartBuild = ({ dataset, state, dispatch }) => {
  const [previewData, setPreviewData] = useState<Record<any, any>>()

  componentDidMount(() => {
    dispatch({ action: "initBuildInfo", buildInfo: BUILD_INFO })
  })
  useEffect(() => {
    if (every([state.buildInfo?.categories, state.buildInfo?.breakby], isEmpty)) {
      return
    }
    api
      .widgetPreview({ buildInfo: state.buildInfo, type: TYPE, dataset })
      .then(setPreviewData)
      .catch(console.log)
  }, [state.buildInfo])

  if (isEmpty(state.buildInfo)) {
    return
  }

  return (
    <div className="flex">
      <div className="w-3/12 h-screen px-4 py-8 overflow-y-auto bg-gray-100">
        <BuildInfoSection
          isDimension
          metadataKey="categories"
          title="Rows"
          state={state}
          dataset={dataset}
          dispatch={dispatch}
        />
        <BuildInfoSection
          isDimension={false}
          metadataKey="values"
          title="Values"
          state={state}
          dataset={dataset}
          dispatch={dispatch}
        />
        <BuildInfoSection
          isDimension
          metadataKey="breakby"
          title="Columns"
          state={state}
          dataset={dataset}
          dispatch={dispatch}
        />
        {/* Tab2: Design */}
      </div>
      <div className="w-9/12 h-screen px-4 py-8 overflow-y-auto overflow-x-auto shadow-md">
        {previewData && <Pivot meta={previewData.meta} theme={{}} />}
      </div>
    </div>
  )
}

const BuildInfoSection = ({ state, dispatch, isDimension, metadataKey, dataset, title }) => {
  const [open, setOpen] = useState(false)
  const handleAdd = (field) => {
    setOpen(false)
    dispatch({ action: "addField", metadataKey, field })
  }
  const handleRemove = (metadataKey, index) => () => dispatch({ action: "removeField", metadataKey, index })
  const Form = isDimension ? AddDimensionModal : AddMeasureModal

  return (
    <div className="mb-10">
      <Form
        open={open}
        datasetFields={dataset.fields}
        includedFields={map(state.buildInfo[metadataKey], "field")}
        onSubmit={handleAdd}
        setShow={setOpen}
      />

      <div className="mb-5">
        <header className="flex items-center justify-between">
          <span className="font-medium">{title}</span>

          <Button onClick={partial(setOpen, true)} className="flex items-center" $iconXs>
            <PlusSmIcon className="w-4 h-4" />
          </Button>
        </header>
        {state.buildInfo[metadataKey].map((item, index) => (
          <BuildItem isDimension key={item.field} item={item} onRemove={handleRemove(metadataKey, index)} />
        ))}
      </div>
    </div>
  )
}

const BuildItem = ({ isDimension, item, onRemove }) => {
  return (
    <div key={item.field} className="flex justify-between items-center shadow-sm bg-white p-2 my-2">
      {item.alias}
      <a className="cursor-pointer" onClick={onRemove}>
        <TrashIcon className="w-4 h-4" />
      </a>
    </div>
  )
}

const AddDimensionModal = ({ open, datasetFields, onSubmit, setShow, includedFields }) => {
  const { register, handleSubmit, reset } = useForm()
  const fieldsCollection = map(datasetFields, (field) => ({ value: field.name }))
  const onSubmitFlow = flow([onSubmit, reset])

  return (
    <Modal show={open} onClose={setShow} $sm>
      <form onSubmit={handleSubmit(onSubmitFlow)}>
        <Modal.Body>
          <Modal.Title>Add Dimension</Modal.Title>

          <SelectField
            collection={fieldsCollection}
            label="Field"
            className="mb-5"
            register={register("field", { required: true })}
          />
          <TextField label="Alias" className="mb-5" register={register("alias", { required: true })} />
        </Modal.Body>
        <Modal.Actions>
          <Button $primary className="ml-2">
            Save
          </Button>
          <Button className="ml-2" onClick={partial(setShow, false)}>
            Cancel
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  )
}

const AddMeasureModal = ({ open, datasetFields, onSubmit, setShow, includedFields }) => {
  const { register, handleSubmit, reset } = useForm()
  const fieldsCollection = map(datasetFields, (field) => ({ value: field.name }))
  const fnsCollection = map(FUNCTIONS, (value) => ({ value }))
  const onSubmitFlow = flow([onSubmit, reset])

  return (
    <Modal show={open} onClose={setShow} $sm>
      <form onSubmit={handleSubmit(onSubmitFlow)}>
        <Modal.Body>
          <Modal.Title>Add Measure</Modal.Title>
          <SelectField
            collection={fnsCollection}
            label="Function"
            className="mb-5"
            register={register("function", { required: true })}
          />
          <SelectField
            collection={fieldsCollection}
            label="Field"
            className="mb-5"
            register={register("field", { required: true })}
          />
          <TextField label="Alias" className="mb-5" register={register("alias", { required: true })} />
        </Modal.Body>
        <Modal.Actions>
          <Button $primary className="ml-2" type="submit">
            Save
          </Button>
          <Button className="ml-2" onClick={partial(setShow, false)}>
            Cancel
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  )
}
