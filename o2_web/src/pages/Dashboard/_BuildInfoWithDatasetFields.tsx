import { TrashIcon, PlusSmIcon } from "@heroicons/react/outline"
import { Button } from "../../components/Button"
import { reduce, map, filter, isEmpty } from "lodash-es"
import { useEffect, useMemo } from "react"
import { useImmerReducer } from "use-immer"
import { Popover } from "../../components/Popover"
import { useOutletContext } from "react-router-dom"
import { Title } from "playbook-ui"
import type { WidgetType, Dataset, Dashboard, DatasetTable } from "../../lib/codegenGraphql"

type BuildInfoSectionType = { renderDataKey: string; label: string; dataType: dataType }
export type BuildInfoSections = Array<BuildInfoSectionType>
export enum dataType {
  MEASURE = "Measure",
  DIMENSION = "Dimension",
}
const AGGREGATIONS = ["COUNT", "COUNT DISTINCT", "SUM"]
const FUNCTIONS = ["CONTRIBUTION"]
const buildInfoFromSections = (sections: BuildInfoSections): Record<string, []> => {
  const fn = (result, section: BuildInfoSectionType) => ({ ...result, [section.renderDataKey]: [] })
  return reduce(sections, fn, {})
}

const actions = {
  removeField: (draft, { renderDataKey, index }) => {
    draft[renderDataKey].splice(index, 1)
  },
  addField: (draft, { renderDataKey, table, field }) => {
    draft[renderDataKey].push({ name: field.name, alias: field.name, tableId: table.id, agg: `COUNT` })
  },
}

export const BuildInfoWithDatasetFields = ({
  sections,
  onChange,
}: {
  sections: BuildInfoSections
  onChange: any
}) => {
  const initialBuildInfo = useMemo(() => buildInfoFromSections(sections), [sections])
  const { dashboard } = useOutletContext<{ dashboard: Dashboard }>()
  const [buildInfo, dispatch] = useImmerReducer((draft, { action, ...payload }) => {
    actions[action](draft, payload)
  }, initialBuildInfo)

  useEffect(() => {
    const lessThanTwoSections = filter(buildInfo, (section) => !isEmpty(section)).length < 2
    if (lessThanTwoSections) {
      return
    }
    onChange(buildInfo)
    // const data = { buildInfo: state.buildInfo, type, dataset }
    // api.widgetPreview(dashboardId, data).then(setPreviewData).catch(console.log)
  }, [buildInfo])

  return (
    <>
      {sections.map((section) => (
        <BuildInfoSection
          key={section.renderDataKey}
          section={section}
          buildInfo={buildInfo}
          dataset={dashboard.dataset!}
          dispatch={dispatch}
        />
      ))}
    </>
  )
}

const BuildInfoSection = ({
  buildInfo,
  section,
  dispatch,
  dataset,
}: {
  buildInfo: any
  section: BuildInfoSectionType
  dispatch: any
  dataset: Dataset
}) => {
  const didAddField = (table, field) => () => {
    dispatch({ action: "addField", renderDataKey: section.renderDataKey, table, field })
  }
  const didRemoveField = (index) => () => {
    dispatch({ action: "removeField", renderDataKey: section.renderDataKey, index })
  }

  return (
    <div className="mb-10">
      <div className="mb-5">
        <header className="flex items-center justify-between">
          <span className="font-medium">{section.label}</span>

          <Popover
            position="bottom-left"
            Button={
              <Button className="flex items-center" $iconXs>
                <PlusSmIcon className="w-4 h-4" />
              </Button>
            }
          >
            <div className="flex flex-col gap-y-8 max-h-96">
              {dataset.tables.map((table) => (
                <TableFields
                  key={table.id}
                  dataType={section.dataType}
                  table={table}
                  didAddField={didAddField}
                />
              ))}
            </div>
          </Popover>
        </header>

        {buildInfo[section.renderDataKey].map((item, index) => (
          <BuildItem key={item.alias} item={item} onRemove={didRemoveField(index)} />
        ))}
      </div>
    </div>
  )
}

const BuildItem = ({ item, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-2 my-2">
      {item.alias}
      <a className="cursor-pointer" onClick={onRemove}>
        <TrashIcon className="w-4 h-4" />
      </a>
    </div>
  )
}

const FIELD_TYPE_DEFAULT_ACTION = {
  [dataType.MEASURE]: {
    Text: "Count Unique",
    Integer: "Sum",
    Float: "Sum",
    DateTime: "# of years",
  },
  [dataType.DIMENSION]: {
    Text: "All Items",
    Integer: "All Items",
    Float: "All Items",
    DateTime: "All Items",
  },
}
const TableFields = ({
  table,
  dataType,
  didAddField,
}: {
  table: DatasetTable
  dataType: dataType
  didAddField: any
}) => {
  return (
    <div>
      <div className="p-4 border-b">
        <Title size={4}>{table.name}</Title>
      </div>
      <ul>
        {table.fields.map((field) => (
          <Popover.Button
            as="li"
            key={table.id + field.name}
            className="py-2 px-6 group flex items-center gap-x-3 cursor-pointer hover:bg-gray-100"
            onClick={didAddField(table, field)}
          >
            {field.name}
            <span className="invisible group-hover:visible text-gray-300 text-sm">
              {FIELD_TYPE_DEFAULT_ACTION[dataType][field.type]}
            </span>
          </Popover.Button>
        ))}
      </ul>
    </div>
  )
}
