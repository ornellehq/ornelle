import type { AttributeDataTypeType } from "isomorphic-blocs/src/generated/prisma/zod"

export interface AttributeValueUpsertData {
  value: unknown
  entityId: string
  attributeId: string
  dataType: AttributeDataTypeType
  configuration: unknown
}
export type AttributeValueUpsertFn = (
  data: AttributeValueUpsertData,
) => Promise<void>
