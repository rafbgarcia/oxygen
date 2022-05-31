import { api } from "../../lib/api"
import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Button } from "../../components/Button"
import { reduce, map, flow, filter, isEmpty } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import { useImmerReducer } from "use-immer"
import { Popover } from "../../components/Popover"
import { Widget } from "../../components/Widget"
import { useParams } from "react-router-dom"
import { Title } from "playbook-ui"

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

  return (
    <div className="flex">
      <div className="w-3/12 h-screen px-4 py-8 bg-gray-100">
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
  const tables = dataset.tables
  const fieldsCollection = map(dataset.fields, (field) => ({ value: field.name }))
  const handleAdd = (formData) => {
    dispatch({ action: "addField", metadataKey: section.metadataKey, field: formData })
  }
  const handleRemove = (metadataKey, index) => () => dispatch({ action: "removeField", metadataKey, index })

  return (
    <div className="mb-10">
      <div className="mb-5">
        <header className="flex items-center justify-between">
          <span className="font-medium">{section.label}</span>

          <Popover
            Button={
              <Button className="flex items-center" $iconXs>
                <PlusSmIcon className="w-4 h-4" />
              </Button>
            }
          >
            <div className="flex flex-col gap-y-8 max-h-96">
              {tables.map((table) => (
                <TableFields dataType={section.dataType} table={table} />
              ))}
            </div>
          </Popover>
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

const MAP = {
  [DIMENSION]: {
    Text: "All values",
    Integer: "Sum",
    Float: "Sum",
    DateTime: "# of years",
  },
  [MEASURE]: {
    Text: "All Items",
    Integer: "All Items",
    Float: "All Items",
    DateTime: "All Items",
  },
}
const TableFields = ({ table, dataType }) => {
  return (
    <div>
      <Title size={4}>{table.name}</Title>
      <ul>
        {table.fields.map((field) => (
          <li className="p-2 group flex items-center gap-x-3 cursor-pointer">
            {field.name}
            <div className="invisible group-hover:visible text-gray-300 text-sm">
              {MAP[dataType][field.type]}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
