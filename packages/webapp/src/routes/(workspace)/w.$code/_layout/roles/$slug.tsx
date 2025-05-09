import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useEntityDelete } from "~/core/workspace/entities/use-entity-delete"
import {
  useMergeRoleColumns,
  useRoleFieldUpdateHandlers,
} from "~/core/workspace/role/hooks"
import { getRoleFilters } from "~/core/workspace/role/util"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"
import type { SortColumn } from "~/types"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/roles/$slug",
)({
  component: RolesView,
})

function RolesView() {
  const api = useWorkspaceApi()
  const { slug } = Route.useParams()
  const { data: view } = useQuery({
    queryKey: [api.view.getView.name, slug] as const,
    queryFn: ({ queryKey }) => api.view.getView({ id: queryKey[1] }),
  })
  if (!view) return null

  const { data: attributes, status: attributesStatus } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Role,
  ])
  const mergeColumns = useMergeRoleColumns()
  const { showDeleteConfirmation } = useEntityDelete({
    entityType: "Role",
    entityName: "Role",
  })

  const config = view.config as {
    filters: SelectedFilter[]
    sorting?: SortColumn[]
  }
  const fieldUpdateHandlers = useRoleFieldUpdateHandlers()

  if (attributesStatus !== "success") return null

  const filters = getRoleFilters({ attributes })

  return (
    <EntityViewLayout
      viewId={view.id}
      entityType="Role"
      attributes={attributes}
      filters={filters}
      breadCrumbs={[
        {
          id: "roles",
          children: "Roles",
          link: "..",
        },
        {
          id: view.id,
          children: view.name,
        },
      ]}
      mergeColumns={mergeColumns}
      defaultSelectedFilters={config.filters.map((selected) => ({
        ...selected,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        ...filters.find((filter) => filter.id === selected.id)!,
      }))}
      fieldUpdateHandlers={fieldUpdateHandlers}
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
      {...(config.sorting ? { sorts: config.sorting } : {})}
    />
  )
}
