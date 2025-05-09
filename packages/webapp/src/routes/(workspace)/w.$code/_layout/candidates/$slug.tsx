import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import { getCandidateFilters } from "~/core/workspace/candidates/utils"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import type { SelectedFilter } from "~/routes/(workspace)/-components/filters/types"
import CandidatesLayout from "./-components/layout"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/candidates/$slug",
)({
  component: CandidatesView,
})

function CandidatesView() {
  const api = useWorkspaceApi()
  const { slug } = Route.useParams()
  const { data: view } = useQuery({
    queryKey: [api.view.getView.name, slug] as const,
    queryFn: ({ queryKey }) => api.view.getView({ id: queryKey[1] }),
  })
  if (!view) return null

  const { data: attributes, status: attributesStatus } = useEntityAttributes(
    GetAttributesEntityTypesEnum.Candidate,
  )
  const config = view.config as { filters: SelectedFilter[] }

  if (attributesStatus !== "success") return null

  const filters = getCandidateFilters({ attributes })

  return (
    <CandidatesLayout
      defaultSelectedFilters={config.filters.map((selected) => ({
        ...selected,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        ...filters.find((filter) => filter.id === selected.id)!,
      }))}
      attributes={attributes}
      filters={filters}
      breadCrumbs={[
        {
          id: "candidates",
          children: "Candidates",
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
