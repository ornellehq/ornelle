import { useQuery } from "@tanstack/react-query"
import type { EntityType } from "isomorphic-blocs/src/prisma"
import type { UseFormReturn } from "react-hook-form"
import type { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import type { AttributeValueUpsertFn } from "~/core/workspace/entities/types"
import { convertAttributeToField } from "~/core/workspace/entities/util"
import CreateAttributePicker from "../create-attribute-picker"
import EntityFields from "./entity-fields"
import type { AttributeRenderDefinition } from "./types"

interface Props {
  entityType: EntityType
  form: UseFormReturn
  onValueUpdate?: AttributeValueUpsertFn
  showAddAttribute?: boolean
  builtInAttributes: AttributeRenderDefinition[]
}

const EntityFieldsSection = ({
  entityType,
  form,
  onValueUpdate,
  showAddAttribute = true,
  builtInAttributes,
}: Props) => {
  const api = useWorkspaceApi()
  const { data: attributes = [] } = useEntityAttributes(
    entityType as GetAttributesEntityTypesEnum,
  )
  const { data: profiles = [], status: profilesStatus } = useQuery({
    queryKey: [api.profile.getProfiles.name],
    queryFn: async () => api.profile.getProfiles(),
  })

  return (
    <div className="flex flex-col gap-y-1 text-[13px] text-gray-600">
      <EntityFields
        entityType={entityType}
        attributes={[
          ...builtInAttributes,
          ...attributes.map((attribute) => ({
            type: "custom" as const,
            ...attribute,
            editable: true,
            _configuration: attribute._configuration ?? {},
            entityId: attribute.entityId,
            id: attribute.id,
            name: attribute.name,
            ...convertAttributeToField(attribute, {
              profiles,
              profilesStatus,
            }),
          })),
        ]}
        form={form}
        {...(onValueUpdate ? { onValueUpdate } : {})}
      />
      {showAddAttribute ? (
        <div>
          <CreateAttributePicker style="button" entityType={entityType} />
        </div>
      ) : null}
    </div>
  )
}

export default EntityFieldsSection
