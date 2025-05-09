import type { AttributeDataType, EntityType } from "isomorphic-blocs/src/prisma"
import type { ReactNode } from "react"

export interface CellEditingComponentProps {
  value: unknown
  close(value?: ReactNode, editing?: boolean): void
  // data: IRow
  configuration: unknown
  width?: string
  activeElement?: HTMLElement
  cellId?: string
  attributeId?: string
  entity: EntityType
  type: "custom" | "system"
  field: AttributeField
  editable?: boolean
}
export type CellEditingComponent =
  React.FunctionComponent<CellEditingComponentProps>
export type AttributeField =
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
export type AttributeRenderDefinition = {
  id: string
  name: string
  transform?(value: unknown): React.ReactNode //  info: { data: unknown }
  value?: unknown
  editable?: boolean
  dataType: AttributeDataType
  field: AttributeField
  plain?: boolean
} & (
  | { type: "system" }
  | { type: "custom"; entityId: string; _configuration: unknown }
)
