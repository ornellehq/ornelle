import type { AttributeDataType, EntityType } from "@prisma/client"

export type FormAttributeLink = {
  type: "custom" | "built-in"
  entity: EntityType | "AI"
  id: string
  name: string
  dataType?: AttributeDataType
}

export type FormField = {
  required: boolean
  name: string
  id: string
  attributeLinked?: FormAttributeLink
} & (
  | {
      type:
        | "text"
        // | "select"
        // | "date"
        | "email"
        | "file"
        | "number"
        | "url"
        | "phone"
        | "toggle"
    }
  | {
      type: "select"
      options: string[]
      maxSelection: "unlimited" | number
    }
  | {
      type: "date"
      includeTime: boolean
      enableEndDate: boolean
    }
)

export interface FormResponse {
  id: string
  answer: unknown
  question: string
  type: FormField["type"]
}
