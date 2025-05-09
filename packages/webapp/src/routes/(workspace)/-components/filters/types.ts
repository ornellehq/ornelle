import type { GetAttributes200ResponseInnerDataTypeEnum } from "sdks/src/server-sdk"
import type { Operator } from "~/lib/conditions"

export type Filter = {
  id: string
  name: string
  icon?: React.ReactElement
  defaultOperator?: Operator
  nullable?: boolean
  origin: "system" | "custom"
} & (
  | { type: Exclude<GetAttributes200ResponseInnerDataTypeEnum, "Select"> }
  | {
      type: "Select"
      options: {
        items: { name: string; id: string }[]
        isMultiSelect: boolean
        nullable: boolean
      }
    }
)
export interface SelectedFilter {
  id: string
  value: unknown
  operator: Operator
}
