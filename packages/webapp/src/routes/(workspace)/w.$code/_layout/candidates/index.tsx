import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { getCandidateFilters } from "~/core/workspace/candidates/utils"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import CandidatesLayout from "./-components/layout"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/candidates/",
)({
  component: Candidates,
})

function Candidates() {
  const { data: attributes, status: attributesStatus } = useEntityAttributes(
    GetAttributesEntityTypesEnum.Candidate,
  )
  const filters = getCandidateFilters({ attributes })

  if (attributesStatus !== "success") return null

  return (
    <CandidatesLayout
      filters={filters}
      attributes={attributes}
      breadCrumbs={[
        {
          id: "candidates",
          children: "Candidates",
        },
      ]}
    />
  )
}
