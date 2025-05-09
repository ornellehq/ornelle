import type { AttributeDataType, EntityType } from "isomorphic-blocs/src/prisma"
import type { ComponentProps, FunctionComponent } from "react"
import type Menu from "webui-library/src/widgets/menu"
import type { AttributeValueUpsertFn } from "~/core/workspace/entities/types"

export interface IRow {
  id: string
}

export interface DataGridColumn<T extends IRow> {
  key: string // keyof T // | (string & {})
  name: string
  sortName?: string
  transform?(value: unknown, info: { data: T }): React.ReactNode
  initialWidth: string
  field:
    | {
        type: "Text"
        options: {
          format?: "rte"
        }
      }
    | {
        type: "Select"
        options: {
          items?: { name: string; id: string }[]
          isMultiSelect?: boolean
          nullable?: boolean
        }
      }
    | {
        type: Exclude<AttributeDataType, "Text" | "Select">
        options?: object
      }
  configuration?: unknown
  type: "system" | "custom"
  hideInGrid?: boolean // Added property to hide columns in grid but keep them available for sorting
  editable?: boolean
  primary?: boolean
}
export interface GridProps<T extends IRow> {
  name: EntityType
  data: T[]
  columns: DataGridColumn<T>[]
  Icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
  setColumns?: React.Dispatch<React.SetStateAction<DataGridColumn<T>[]>>
  customRenders?: Record<string, FunctionComponent<{ value: unknown; data: T }>>
  dontSupportsCustomFields?: boolean
  expand?(row: T): void
  // onFieldUpdate?(data: {
  //   row: T
  //   column: DataGridColumn<T>
  //   value: unknown
  // }): Promise<void>
  onFieldUpdate?: AttributeValueUpsertFn
  onColumnUpdate(data: {
    property: "name" | "_configuration"
    column: DataGridColumn<T>
    value: unknown
  }): Promise<void>
  getIdentifier?(row: T): string
  rowMenu?: (row: T) => Partial<ComponentProps<typeof Menu>>
}
