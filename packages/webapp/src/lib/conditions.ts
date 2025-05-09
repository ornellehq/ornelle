import type { AttributeDataTypeType } from "isomorphic-blocs/src/generated/prisma/zod"

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

export const operatorToLabelMap: Record<Operator, string> = {
  in: "in",
  notIn: "not in",
  eq: "is",
  notEq: "is not",
  contains: "contains",
  notContains: "does not contain",
  gt: "greater than",
  gte: "greater than or equal to",
  lt: "less than",
  lte: "less than or equal to",
  before: "before",
  after: "after",
  between: "between",
  isNull: "is empty",
  isNotNull: "is not empty",
  isTrue: "is true",
  isFalse: "is false",
}
export const typeToOperatorsMap: Record<AttributeDataTypeType, Operator[]> = {
  Select: [
    "eq",
    "notEq",
    // "in",
    // "notIn",
    "contains",
    "notContains",
    "isNotNull",
    "isNull",
  ],
  Text: ["eq", "notEq", "contains", "notContains", "isNotNull", "isNull"],
  Number: ["eq", "notEq", "gt", "gte", "lt", "lte", "isNotNull", "isNull"],
  Date: ["before", "after", "isNotNull", "isNull"],
  Email: ["eq", "notEq", "contains", "notContains", "isNotNull", "isNull"],
  Toggle: ["isTrue", "isFalse", "isNotNull", "isNull"],
  URL: ["eq", "notEq", "contains", "notContains", "isNotNull", "isNull"],
  File: ["contains", "notContains", "isNotNull", "isNull"],
  Phone: ["eq", "notEq", "contains", "notContains", "isNotNull", "isNull"],
  Record: ["eq", "notEq", "isNotNull", "isNull"],
  Range: ["isNotNull", "isNull"],
  Location: ["eq", "notEq", "contains", "notContains", "isNotNull", "isNull"],
  Member: ["eq", "notEq", "isNotNull", "isNull"],
}
export const operators = Object.keys(operatorToLabelMap) as Operator[]
