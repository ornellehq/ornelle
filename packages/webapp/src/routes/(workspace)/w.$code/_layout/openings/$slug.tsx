import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import UserAdd from "webui-library/src/icons/UserAdd"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useEntityDelete } from "~/core/workspace/entities/use-entity-delete"
import {
  useMergeOpeningColumns,
  useOpeningFilters,
  useOpeningsFieldUpdateHandlers,
} from "~/core/workspace/openings/hooks"
import EntityViewLayout from "~/routes/(workspace)/-components/entity/entity-layout"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/openings/$slug",
)({
  component: OpeningsView,
})

function OpeningsView() {
  const api = useWorkspaceApi()
  const { slug } = Route.useParams()
  const { data: view } = useQuery({
    queryKey: [api.view.getView.name, slug] as const,
    queryFn: ({ queryKey }) => api.view.getView({ id: queryKey[1] }),
  })
  if (!view) return null

  const fieldUpdateHandlers = useOpeningsFieldUpdateHandlers()
  const { data: attributes, status: attributesStatus } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Opening,
  ])
  const { showDeleteConfirmation } = useEntityDelete({
    entityType: "Opening",
    entityName: "Opening",
  })

  const config = view.config as { filters: SelectedFilter[] }
  const filters = useOpeningFilters({ attributes })

  if (attributesStatus !== "success") return null

  return (
    <EntityViewLayout
      entityType="Opening"
      attributes={attributes}
      filters={filters}
      breadCrumbs={[
        {
          id: "openings",
          children: "Openings",
          link: "..",
        },
        {
          id: view.id,
          children: view.name,
        },
      ]}
      mergeColumns={useMergeOpeningColumns()}
      defaultSelectedFilters={config.filters.map((selected) => ({
        ...selected,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        ...filters.find((filter) => filter.id === selected.id)!,
      }))}
      fieldUpdateHandlers={fieldUpdateHandlers}
      Icon={UserAdd}
      rowMenu={(opening) => {
        return {
          items: [
            {
              id: "delete",
              children: "Delete",
              onAction: () => showDeleteConfirmation(opening.id),
            },
          ],
        }
      }}
    />
  )
}
