import type { EntityType } from "isomorphic-blocs/src/prisma"
import type { UseFormReturn } from "react-hook-form"
import { queryClient } from "~/core/network.js"
import {
  useEntityTypeToQueryKeyMap,
  useOnFieldUpdate,
} from "~/core/workspace/entities/hooks"
import type { AttributeValueUpsertFn } from "~/core/workspace/entities/types"
import { globals } from "~/core/workspace/globals.js"
import EntityFieldsSection from "../../attributes/entity-fields-section.js"
import EntityFields from "../../attributes/entity-fields.js"
import type { AttributeRenderDefinition } from "../../attributes/types.js"

interface EntityLayoutProps {
  id: string
  title: React.ReactNode
  entityType: EntityType
  createdAt?: string | Date
  form: UseFormReturn
  builtInAttributes: AttributeRenderDefinition[] // ({ ValueComponent: FunctionComponent } | { value: string }))[]
  updateHandlers?: Parameters<typeof useOnFieldUpdate>[0]["updateHandlers"]
  showCustomAttributes?: boolean
  showAddAttribute?: boolean
}

const EntityLayout = ({
  id,
  title,
  builtInAttributes,
  children,
  createdAt,
  entityType,
  form,
  updateHandlers,
  showCustomAttributes = true,
  showAddAttribute = true,
}: React.PropsWithChildren<EntityLayoutProps>) => {
  const entityTypeToQueryKeyMap = useEntityTypeToQueryKeyMap()
  const onAttributeValueUpdate = useOnFieldUpdate({
    invalidate: ({ entityId }) => {
      const listKey = [
        entityTypeToQueryKeyMap.list[entityType],
        globals.filters[entityType],
        globals.sorts,
      ]
      queryClient.invalidateQueries({
        queryKey: [entityTypeToQueryKeyMap.single[entityType], entityId],
      })
      queryClient.invalidateQueries({
        queryKey: listKey,
      })
    },
    ...(updateHandlers ? { updateHandlers } : {}),
  })
  const onValueUpdate: AttributeValueUpsertFn = async ({
    value,
    attributeId,
    configuration,
    dataType,
  }) => {
    onAttributeValueUpdate({
      attributeId,
      entityId: id,
      value,
      dataType,
      configuration,
    })
  }

  return (
    <div className="flex 3xl:w-[36rem] w-[28rem] flex-1 flex-col gap-y-3 overflow-y-auto pb-20 2xl:w-[32rem]">
      {typeof title === "string" ? (
        <h2 className="mt-4 border-none px-6 text-2xl outline-none">{title}</h2>
      ) : (
        title
      )}
      <div>
        {builtInAttributes.length ? (
          <div className="-mb-1 flex flex-col gap-y-1 px-4 text-[13px] text-gray-600">
            <EntityFields
              form={form}
              entityType={entityType}
              onValueUpdate={onValueUpdate}
              attributes={[
                ...builtInAttributes,
                ...(createdAt
                  ? [
                      {
                        id: "createdAt",
                        name: "Created",
                        editable: false,
                        type: "system" as const,
                        dataType: "Text" as const,
                        field: {
                          type: "Text" as const,
                          options: {},
                        },
                        // value: dayjs(createdAt).format("MMMM DD, YYYY h:m A"),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        ) : null}
        {showCustomAttributes ? (
          <div className="py-1 pr-6 pl-4">
            <EntityFieldsSection
              form={form}
              entityType={entityType}
              onValueUpdate={onValueUpdate}
              showAddAttribute={showAddAttribute}
              builtInAttributes={[]}
            />
          </div>
        ) : null}
      </div>
      {/* {showCustomAttributes ? (
        <div className="mx-6 border-gray-200 border-t border-solid" />
      ) : null} */}
      {children}
    </div>
  )
}

export default EntityLayout

/**
 * Convert AI field to custom field
 * Out of the box custom fields for common resume data points
 * Generate structured resume data points
 * Generate embeddings for generated data points
 * Show AI columns
 * Settings to automatically create custom fields from AI data points/suggestions
 * Score card columns
 * AI review summary
 *
 * Data to store: Match score, match summary, structured resume data, common columns,
 * Get resume -> Extract plain info
 *
 *
 * Automatic columns:
 * Skills, Degrees, Last company, Years of relevant experience, previous companies, average duration at positions
 * time since graduation, previous companies, website, contact (phone), certifications, gap between roles
 * career progression, remote work experience,
 */
