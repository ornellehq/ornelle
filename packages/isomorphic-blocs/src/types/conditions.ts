import type { AttributeDataType } from "@prisma/client"

export type Operator =
  | "in"
  | "notIn"
  | "eq"
  | "notEq"
  | "contains"
  | "notContains"
  | "between"
  | "gt"
  | "lt"
  | "lte"
  | "gte"
  | "isNull"
  | "isNotNull"
  | "before"
  | "after"
  | "isTrue"
  | "isFalse"

export interface Filter {
  id: string
  name: string
  type: AttributeDataType
  defaultOperator?: Operator
  nullable?: boolean
  origin: "system" | "custom"
}

export interface SelectedFilter {
  id: string
  value: unknown
  operator: Operator
}
