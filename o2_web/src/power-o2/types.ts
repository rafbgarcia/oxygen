import { ReactNode } from 'react'

export interface Widget {
  meta: Record<string, any>
  theme: Record<string, any>
}

export interface PivotWidget extends Widget {
  meta: {
    html: string
  }
  theme: {
    table?: ComponentTheme
  }
}

export type WidgetType = 'pivot' | 'vertical_bar_chart'

export type ComponentTheme = ({
  children,
}: {
  children: ReactNode
}) => JSX.Element

export type DashboardTheme = {
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

export type DashboardJSON = {
  title: string
  dataLastUpdatedAt: string
  gridRows: Array<GridRowJson>
}
