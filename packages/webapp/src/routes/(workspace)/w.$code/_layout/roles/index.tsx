import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useEntityDelete } from "~/core/workspace/entities/use-entity-delete"
import {
  useMergeRoleColumns,
  useRoleFieldUpdateHandlers,
} from "~/core/workspace/role/hooks"
import { getRoleFilters } from "~/core/workspace/role/util"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"

export const Route = createFileRoute("/(workspace)/w/$code/_layout/roles/")({
  component: Roles,
})

function Roles() {
  const { data: attributes, status } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Role,
  ])
  const filters = getRoleFilters({ attributes })
  const fieldUpdateHandlers = useRoleFieldUpdateHandlers()

  const { showDeleteConfirmation } = useEntityDelete({
    entityType: "Role",
    entityName: "Role",
  })

  const mergeColumns = useMergeRoleColumns()

  if (status !== "success") return null

  return (
    <EntityViewLayout
      entityType="Role"
      attributes={attributes}
      filters={filters}
      breadCrumbs={[
        {
          id: "roles",
          children: "Roles",
        },
      ]}
      fieldUpdateHandlers={fieldUpdateHandlers}
      mergeColumns={mergeColumns}
      rowMenu={(role) => {
        return {
          items: [
            {
              id: "delete",
              children: "Delete",
              onAction: () => showDeleteConfirmation(role.id),
            },
          ],
        }
      }}
    />
  )
}
