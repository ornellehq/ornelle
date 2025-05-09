import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"
import ApplicationsLayout from "./-components/applications-layout"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/applications/$slug",
)({
  component: ApplicationsView,
})

function ApplicationsView() {
  const api = useWorkspaceApi()
  const { slug } = Route.useParams()
  const { data: view } = useQuery({
    queryKey: [api.view.getView.name, slug] as const,
    queryFn: ({ queryKey }) => api.view.getView({ id: queryKey[1] }),
  })
  const { data: attributes, status: attributesStatus } = useEntityAttributes(
    GetAttributesEntityTypesEnum.Application,
  )

  if (!view) return null

  const config = view.config as { filters: SelectedFilter[] }

  if (attributesStatus !== "success") return null

  return (
    <ApplicationsLayout
      defaultSelectedFilters={config.filters}
      attributes={attributes}
      breadCrumbs={[
        {
          id: "applications",
          children: "Applications",
          link: "..",
        },
        {
          id: view.name,
          children: view.name,
        },
      ]}
      viewId={view.id}
    />
  )
}
