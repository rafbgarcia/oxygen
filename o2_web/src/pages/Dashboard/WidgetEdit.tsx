import { Button } from "playbook-ui"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import type { Dashboard } from "../../lib/codegenGraphql"
import { Popover } from "../../components/Popover"
import { find } from "lodash-es"

export const WidgetEdit = () => {
  const { dashboard } = useOutletContext<{ dashboard: Dashboard }>()
  const { widgetId } = useParams()
  const navigate = useNavigate()

  const widget = find(dashboard.widgets, { id: widgetId })

  return (
    <aside className="bg-white h-full z-10 w-[300px] min-h-screen shadow-md">
      <div className="p-4">Pivot Table</div>
    </aside>
  )
}
