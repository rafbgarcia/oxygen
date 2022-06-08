import { Button, Title } from "playbook-ui"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import {
  useDeleteWidgetMutation,
  useUpdateWidgetBuildInfoMutation,
  WidgetType,
} from "../../../lib/codegenGraphql"
import type { DashboardQuery } from "../../../lib/codegenGraphql"
import { find } from "lodash-es"
import React, { Fragment } from "react"
import { Spinner } from "../../../components/Spinner"
import { BuildInfoWithDatasetFields } from "./BuildInfoWithDatasetFields"
import { BuildInfoText } from "./BuildInfoText"
import { Tab } from "@headlessui/react"
import { classnames } from "../../../lib/classnames"

const WIDGET_TYPE_ELEMENT: Record<WidgetType, any> = {
  [WidgetType.PivotTable]: BuildInfoWithDatasetFields,
  [WidgetType.VerticalBarChart]: BuildInfoWithDatasetFields,
  [WidgetType.Text]: BuildInfoText,
}

export const WidgetEdit = () => {
  const { dashboard } = useOutletContext<{ dashboard: DashboardQuery["dashboard"] }>()
  const { widgetId } = useParams()
  const navigate = useNavigate()
  const [updateBuildInfo, { loading }] = useUpdateWidgetBuildInfoMutation()
  const [removeWidget, { loading: deleting }] = useDeleteWidgetMutation()

  const widget = find(dashboard.widgets, { id: widgetId }) as
    | DashboardQuery["dashboard"]["widgets"][0]
    | undefined

  const didCancelEdit = () => navigate(`/dashboards/${dashboard.id}/edit`)
  const didChangeBuildInfo = (buildInfo) => {
    updateBuildInfo({ variables: { buildInfo, widgetId: widgetId! } })
  }
  const didRemoveWidget = () => {
    removeWidget({ variables: { widgetId: widgetId! } }).then(didCancelEdit)
  }

  return (
    <Tab.Group>
      <aside className="z-10 w-[300px] fixed right-0">
        <div className="p-4">
          <Tab.List className="flex items-center justify-between border-b mb-8">
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={classnames(
                    "p-2 block grow cursor-pointer text-center outline-none font-medium",
                    {
                      "opacity-100 font-gray-900": selected,
                      "opacity-50": !selected,
                    }
                  )}
                >
                  Build
                </a>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={classnames(
                    "p-2 block grow cursor-pointer text-center outline-none font-medium",
                    {
                      "opacity-100 font-gray-900": selected,
                      "opacity-50": !selected,
                    }
                  )}
                >
                  Design
                </a>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={classnames(
                    "p-2 block grow cursor-pointer text-center outline-none font-medium",
                    {
                      "opacity-100 font-gray-900": selected,
                      "opacity-50": !selected,
                    }
                  )}
                >
                  Filters
                </a>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {" "}
              {widget ? (
                React.createElement(WIDGET_TYPE_ELEMENT[widget.type], {
                  key: widget.id,
                  onChange: didChangeBuildInfo,
                  dataset: dashboard.dataset,
                  buildInfo: widget.buildInfo,
                })
              ) : (
                <p className="mb-5">Widget not found</p>
              )}
            </Tab.Panel>
          </Tab.Panels>

          <div className="flex items-center gap-x-2 mt-10">
            <Button variant="secondary" onClick={didCancelEdit}>
              Close
            </Button>
            <Button variant="secondary" onClick={didRemoveWidget} loading={deleting}>
              Remove
            </Button>
          </div>
        </div>
      </aside>
    </Tab.Group>
  )
}
