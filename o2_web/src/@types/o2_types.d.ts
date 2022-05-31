export declare global {
  // interface Dataset {
  //   id: number
  //   name: string
  //   buildDurationSeconds: number
  //   isBuilding: boolean
  //   lastBuiltAt: string
  //   sizeMb: string
  //   tables: Array<DatasetTable>
  // }

  // interface DatasetTable {
  //   fields: Array<{ name: string; type: string }>
  //   name: string
  //   query: string
  //   htmlPreview: string
  //   totalRecords: number
  //   query: string
  // }
  interface Widget {
    meta?: Record<string, any>
    theme?: Record<string, any>
  }

  type ComponentTheme = (any) => JSX.Element

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
