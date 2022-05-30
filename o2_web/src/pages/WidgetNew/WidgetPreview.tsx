import { api } from "../../lib/api"
import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Modal } from "../../components/Modal"
import { Button } from "../../components/Button"
import { reduce, map, partial, flow, filter, isEmpty } from "lodash-es"
import { TextField } from "../../components/TextField"
import { SelectField } from "../../components/SelectField"
import { useForm } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
import { useImmerReducer } from "use-immer"

import { Widget } from "../../components/Widget"
import { useParams } from "react-router-dom"

type BuildInfoSection = { metadataKey: string; label: string; dataType: string }
type BuildInfoMapping = Record<WidgetType, Array<BuildInfoSection>>

const MEASURE = "Measure"
const DIMENSION = "Dimension"
const AGGREGATIONS = ["COUNT", "COUNT DISTINCT", "SUM"]
const FUNCTIONS = ["CONTRIBUTION"]
const BUILD_INFO_SECTIONS: BuildInfoMapping = {
  pivot_table: [
    { metadataKey: "rows", label: "Rows", dataType: DIMENSION },
    { metadataKey: "values", label: "Values", dataType: MEASURE },
    { metadataKey: "columns", label: "Columns", dataType: DIMENSION },
  ],
  vertical_bar_chart: [
    { metadataKey: "rows", label: "Categories", dataType: DIMENSION },
    { metadataKey: "values", label: "Values", dataType: MEASURE },
    { metadataKey: "columns", label: "Break by", dataType: DIMENSION },
  ],
}

const initialBuildInfo = (type: WidgetType): Record<string, []> => {
  return reduce(
    BUILD_INFO_SECTIONS[type],
    (result, section) => {
      result[section.metadataKey] = []
      return result
    },
    {}
  )
}

const actions = {
  removeField: (draft, { metadataKey, index }) => {
    draft.buildInfo[metadataKey].splice(index, 1)
  },
  addField: (draft, { metadataKey, field }) => {
    draft.buildInfo[metadataKey].push(field)
  },
}

export const WidgetPreview = ({
  type,
  dataset,
  onChange,
}: {
  type: WidgetType
  dataset: Dataset
  onChange: any
}) => {
  const { dashboardId } = useParams()
  const initialState = useMemo(
    () => ({
      buildInfo: initialBuildInfo(type),
      // designInfo: {}
    }),
    []
  )
  const [previewData, setPreviewData] = useState<Record<any, any>>()
  const [state, dispatch] = useImmerReducer((draft, { action, ...payload }) => {
    actions[action](draft, payload, onChange)
  }, initialState)

  useEffect(() => {
    const lessThanTwoSections = filter(state.buildInfo, (section) => !isEmpty(section)).length < 2
    if (lessThanTwoSections) {
      return
    }
    onChange(state)
    const data = { buildInfo: state.buildInfo, type, dataset }
    api.widgetPreview(dashboardId, data).then(setPreviewData).catch(console.log)
  }, [state.buildInfo])

  if (!type || !dataset) {
    return <></>
  }

  return (
    <div className="flex">
      <div className="w-3/12 h-screen px-4 py-8 overflow-y-auto bg-gray-100">
        {BUILD_INFO_SECTIONS[type].map((section) => (
          <BuildInfoSection
            key={section.metadataKey}
            section={section}
            buildInfo={state.buildInfo}
            dataset={dataset}
            dispatch={dispatch}
          />
        ))}
        {/* Tab2: Design */}
      </div>
      <div className="w-9/12 h-screen px-4 py-8 overflow-y-auto overflow-x-auto shadow-md">
        <Widget type={type} meta={previewData?.meta} theme={{}} />
      </div>
    </div>
  )
}

const BuildInfoSection = ({
  buildInfo,
  section,
  dispatch,
  dataset,
}: {
  buildInfo: any
  section: BuildInfoSection
  dispatch: any
  dataset: any
}) => {
  const [open, setOpen] = useState(false)
  const handleAdd = (formData) => {
    setOpen(false)
    dispatch({ action: "addField", metadataKey: section.metadataKey, field: formData })
  }
  const handleRemove = (metadataKey, index) => () => dispatch({ action: "removeField", metadataKey, index })
  const Form = section.dataType == DIMENSION ? AddDimensionModal : AddMeasureModal

  return (
    <div className="mb-10">
      <Form open={open} dataset={dataset} onSubmit={handleAdd} setShow={setOpen} />

      <div className="mb-5">
        <header className="flex items-center justify-between">
          <span className="font-medium">{section.label}</span>

          <Button onClick={partial(setOpen, true)} className="flex items-center" $iconXs>
            <PlusSmIcon className="w-4 h-4" />
          </Button>
        </header>
        {buildInfo[section.metadataKey].map((item, index) => (
          <BuildItem
            key={item.function + item.agg + item.name + item.alias}
            item={item}
            onRemove={handleRemove(section.metadataKey, index)}
          />
        ))}
      </div>
    </div>
  )
}

const BuildItem = ({ item, onRemove }) => {
  return (
    <div className="flex justify-between items-center shadow-sm bg-white p-2 my-2">
      {item.alias}
      <a className="cursor-pointer" onClick={onRemove}>
        <TrashIcon className="w-4 h-4" />
      </a>
    </div>
  )
}

const AddDimensionModal = ({ open, dataset, onSubmit, setShow }) => {
  const { register, handleSubmit, reset } = useForm()
  const fieldsCollection = map(dataset.fields, (field) => ({ value: field.name }))
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
            register={register("name", { required: true })}
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

const AddMeasureModal = ({ open, dataset, onSubmit, setShow }) => {
  const { register, handleSubmit, reset } = useForm()
  const fieldsCollection = map(dataset.fields, (field) => ({ value: field.name }))
  const aggCollection = map(AGGREGATIONS, (value) => ({ value }))
  const fnsCollection = map(FUNCTIONS, (value) => ({ value }))
  const onSubmitFlow = flow([onSubmit, reset])

  return (
    <Modal show={open} onClose={setShow} $sm>
      <form onSubmit={handleSubmit(onSubmitFlow)}>
        <Modal.Body>
          <Modal.Title>Add Measure</Modal.Title>
          <SelectField
            collection={aggCollection}
            label="Aggregation"
            className="mb-5"
            register={register("agg", { required: true })}
          />
          <SelectField
            collection={fieldsCollection}
            label="Field"
            className="mb-5"
            register={register("name", { required: true })}
          />
          <SelectField
            collection={fnsCollection}
            allowBlank
            label="Function"
            className="mb-5"
            register={register("function", { required: false })}
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
