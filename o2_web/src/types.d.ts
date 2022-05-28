declare module "playbook-ui"
declare module "SWRHook"
export declare global {
  interface Widget {
    meta?: Record<string, any>
    theme?: Record<string, any>
  }

  interface PivotWidget extends Widget {
    meta?: {
      html: string
    }
    theme?: {
      table?: ComponentTheme
    }
  }
  interface VerticalBarChartWidget extends Widget {
    meta?: {
      html: string
    }
    theme?: {
      chart?: ComponentTheme
    }
  }

  type ComponentTheme = ({ children }: { children: ReactNode }) => JSX.Element

  type DashboardTheme = {
    title?: ComponentTheme
    widgets?: {
      pivot?: {
        table?: ComponentTheme
      }
      verticalBarChart?: {
        table?: ComponentTheme
      }
    }
  }

  /**
   * API Responses
   */

  /**
   * Dashboard
   */
  type DashboardJSON = {
    title: string
    dataLastUpdatedAt: string
    gridRows: [
      {
        widgets: [WidgetJSON]
      }
    ]
  }

  /**
   * Widget
   */
  type WidgetType = "pivot_table" | "vertical_bar_chart"

  type WidgetJSON = {
    id: number
    type: WidgetType
    meta: PivotMeta
    build: PivotBuild
  }
  type PivotMeta = {
    html: string
  }
  type PivotBuild = {
    columns: [{ field: string; alias: string }]
    rows: [{ field: string; alias: string }]
    values: [{ fn: string; field: string; alias: string }]
  }
}
