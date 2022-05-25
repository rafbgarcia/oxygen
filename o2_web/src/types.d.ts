declare module 'playbook-ui'

export declare global {
  interface Widget {
    meta: Record<string, any>
    theme: Record<string, any>
  }

  interface PivotWidget extends Widget {
    meta: {
      html: string
    }
    theme: {
      table?: ComponentTheme
    }
  }

  type WidgetType = 'pivot' | 'vertical_bar_chart'

  type ComponentTheme = ({ children }: { children: ReactNode }) => JSX.Element

  type DashboardTheme = {
    title?: ComponentTheme
    widgets?: {
      pivot?: {
        table?: ComponentTheme
      }
    }
  }

  type WidgetJSON = {
    id: number
    type: WidgetType
    meta: any
  }

  type GridRowJson = {
    widgets: Array<WidgetJSON>
  }

  type DashboardJSON = {
    title: string
    dataLastUpdatedAt: string
    gridRows: Array<GridRowJson>
  }
}
