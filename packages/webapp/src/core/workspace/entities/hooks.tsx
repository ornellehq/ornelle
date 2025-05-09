import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import type { EntityType } from "isomorphic-blocs/src/prisma.js"
import { useEffect, useMemo } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"
import type {
  CreateAttributeRequestConfigurationAnyOf2,
  GetAttributes200ResponseInner,
  GetAttributesEntityTypesEnum,
} from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import type {
  DataGridColumn,
  GridProps,
  IRow,
} from "~/routes/(workspace)/-components/data-grid/types"
import { useWorkspaceApi } from "../api.js"
import type {
  AttributeValueUpsertData,
  AttributeValueUpsertFn,
} from "./types.js"
import { convertAttributeToField } from "./util.js"

export const useEntityAttributes = (
  entityTypes: GetAttributesEntityTypesEnum | GetAttributesEntityTypesEnum[],
) => {
  const _entityTypes =
    typeof entityTypes === "object" ? entityTypes : [entityTypes]
  const api = useWorkspaceApi()
  const { data: attributesData, status } = useQuery({
    queryKey: [api.attribute.getAttributes.name, ..._entityTypes],
    queryFn: () => {
      return api.attribute.getAttributes({
        entityTypes: _entityTypes,
      })
    },
  })

  return { data: attributesData ?? [], status }
}

export const useAttributeColumns = <T extends IRow>(
  attributes: GetAttributes200ResponseInner[],
): DataGridColumn<T>[] => {
  const api = useWorkspaceApi()
  const { data: profiles = [], status: profilesStatus } = useQuery({
    queryKey: [api.profile.getProfiles.name],
    queryFn: async () => {
      return api.profile.getProfiles()
    },
  })
  // biome-ignore lint/correctness/useExhaustiveDependencies: Passing stringified json is better for performance and status is not needed
  const columns = useMemo<DataGridColumn<T>[]>(
    () =>
      attributes?.map((attribute) => {
        const { _configuration, dataType } = attribute
        return {
          key: attribute.id,
          name: attribute.name,
          type: "custom",
          initialWidth: "w-44",
          editable: true,
          ...convertAttributeToField(attribute, {
            profiles,
            profilesStatus: profilesStatus,
          }),
        }
      }) ?? [],
    [
      attributes,
      JSON.stringify(
        profiles.map((profile) => ({
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.displayName,
        })),
      ),
    ],
  )
  return columns
}

export const useOnFieldUpdate = ({
  invalidate,
  updateHandlers,
}: {
  invalidate?(data: { entityId: string }): void
  updateHandlers?: Record<
    string,
    (data: AttributeValueUpsertData) => Promise<void>
  >
}): AttributeValueUpsertFn => {
  const api = useWorkspaceApi()

  return async (data) => {
    const {
      value,
      entityId,
      attributeId,
      dataType,
      configuration: _configuration,
    } = data
    const upsertAttributeValue = async (data = { value }) => {
      await api.attributeValue.upsertAttributeValues({
        upsertAttributeValuesRequestInner: [
          {
            entityId,
            attributeId,
            data,
          },
        ],
      })
    }

    // TODO: Narrow column.key type
    const customHandler = updateHandlers?.[attributeId]

    if (customHandler) {
      await customHandler(data)
    } else {
      switch (dataType) {
        case "Text":
          {
            await upsertAttributeValue()
          }
          break
        case "Email":
          {
            await upsertAttributeValue()
          }
          break
        case "Number":
          {
            const n = Number(value)
            if (!Number.isNaN(n)) {
              const configuration =
                _configuration as CreateAttributeRequestConfigurationAnyOf2
              await upsertAttributeValue({
                value: configuration?.format === "Currency" ? n * 100 : n,
              })
            }
          }
          break
        case "Date":
          {
            await upsertAttributeValue()
          }
          break
        case "Toggle":
          {
            await upsertAttributeValue()
          }
          break
        case "URL":
          {
            await upsertAttributeValue()
          }
          break
        case "Select":
          {
            await upsertAttributeValue()
          }
          break
        case "Member":
          {
            await upsertAttributeValue()
          }
          break
        default:
          break
      }
    }

    invalidate?.({ entityId })
  }
}

export const useOnColumnUpdate = <T extends IRow>(
  entityType: GetAttributesEntityTypesEnum,
): GridProps<T>["onColumnUpdate"] => {
  const api = useWorkspaceApi()
  return async ({ column, property, value }) => {
    if (property === "name" || property === "_configuration") {
      await api.attribute.updateAttribute({
        id: column.key as string,
        updateAttributeRequest: { [property]: value },
      })
      await queryClient.invalidateQueries({
        queryKey: [api.attribute.getAttributes.name, entityType],
      })
    }
  }
}

export const useEntityTypeToQueryKeyMap = () => {
  const api = useWorkspaceApi()
  const entityTypeToQueryKey: Record<EntityType, string> = {
    Application: api.application.getApplications.name,
    Candidate: api.candidate.getCandidates.name,
    Role: api.role.getRoles.name,
    Opening: api.opening.getOpenings.name,
    Custom: "",
  }
  const entityTypeToSingleQueryKey: Record<EntityType, string> = {
    Application: api.application.getApplication.name,
    Candidate: api.candidate.getCandidate.name,
    Role: api.role.getRole.name,
    Opening: api.opening.getOpening.name,
    Custom: "",
  }
  return {
    list: entityTypeToQueryKey,
    single: entityTypeToSingleQueryKey,
  }
}

export const useSyncEntityForm = ({
  form,
  data,
}: { data: Record<string, string>; form: UseFormReturn<FieldValues> }) => {
  useEffect(() => {
    const entries = Object.entries(data)
    for (const [key, value] of entries) {
      if (
        JSON.stringify(value ?? {}) !==
        JSON.stringify(form.formState.defaultValues?.[key] ?? {})
      )
        form.setValue(
          key,
          key === "createdAt"
            ? dayjs(value).format("MMMM DD, YYYY h:m A")
            : value,
        )
    }
  }, [data, form])
}
