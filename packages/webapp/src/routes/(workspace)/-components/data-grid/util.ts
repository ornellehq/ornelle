import { createContext, useContext } from "react"
import type { DataGridColumn, GridProps, IRow } from "./types"

export type IDataGridContext<T extends IRow> = Pick<
  GridProps<T>,
  "onFieldUpdate"
> & {
  columns?: DataGridColumn<T>[]
  setColumns?: GridProps<T>["setColumns"]
}
export const DataGridContext = createContext<IDataGridContext<IRow>>({})
export const useDataGridContext = () => useContext(DataGridContext)
