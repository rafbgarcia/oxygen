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

type BuildInfoSection = { metadataKey: string; label: string; dataType: string }
type BuildInfoMapping = Record<WidgetType, Array<BuildInfoSection>>

const MEASURE = "Measure"
const DIMENSION = "Dimension"
const FUNCTIONS = ["COUNT", "COUNT DISTINCT", "SUM"]
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

const initialBuild = (type: WidgetType): Record<string, []> => {
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
    draft.build[metadataKey].splice(index, 1)
  },
  addField: (draft, { metadataKey, field }) => {
    draft.build[metadataKey].push(field)
  },
}

export const WidgetPreview = ({
  type,
  dataset,
  onChange,
}: {
  type: WidgetType
  dataset: any
  onChange: any
}) => {
  if (!type || !dataset) {
    return <></>
  }
  const initialState = useMemo(
    () => ({
      build: initialBuild(type),
      // design: {}
    }),
    []
  )
  const [previewData, setPreviewData] = useState<Record<any, any>>()
  const [state, dispatch] = useImmerReducer((draft, { action, ...payload }) => {
    actions[action](draft, payload, onChange)
  }, initialState)

  useEffect(() => {
    const lessThanTwoSections = filter(state.build, (section) => !isEmpty(section)).length < 2
    if (lessThanTwoSections) {
      return
    }
    onChange(state)
    api.widgetPreview({ buildInfo: state, type, dataset }).then(setPreviewData).catch(console.log)
  }, [state.build])

  return (
    <div className="flex">
      <div className="w-3/12 h-screen px-4 py-8 overflow-y-auto bg-gray-100">
        {BUILD_INFO_SECTIONS[type].map((section) => (
          <BuildInfoSection
            key={section.metadataKey}
            section={section}
            build={state.build}
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
  build,
  section,
  dispatch,
  dataset,
}: {
  build: any
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
        {build[section.metadataKey].map((item, index) => (
          <BuildItem key={item.field} item={item} onRemove={handleRemove(section.metadataKey, index)} />
        ))}
      </div>
    </div>
  )
}

const BuildItem = ({ item, onRemove }) => {
  return (
    <div key={item.field} className="flex justify-between items-center shadow-sm bg-white p-2 my-2">
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

const AddMeasureModal = ({ open, dataset, onSubmit, setShow }) => {
  const { register, handleSubmit, reset } = useForm()
  const fieldsCollection = map(dataset.fields, (field) => ({ value: field.name }))
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