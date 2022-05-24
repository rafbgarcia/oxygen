export interface Widget {
  meta: any
  theme: any
}

export interface PivotWidget extends Widget {
  meta: {
    html: string,
  },
  theme: {
    table: ({ children }: any) => JSX.Element
  }
}


export type WidgetType = "pivot" | "column_barchart"
