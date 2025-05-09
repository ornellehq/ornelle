import { createFileRoute } from "@tanstack/react-router"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import ApplicationsLayout from "./-components/applications-layout"

export const Route = createFileRoute(
  "/(workspace)/w/$code/_layout/applications/",
)({
  component: Applications,
})

function Applications() {
  const { data: attributesData, status: attributesStatus } =
    useEntityAttributes(GetAttributesEntityTypesEnum.Application)

  if (attributesStatus !== "success") return null

  return (
    <ApplicationsLayout
      attributes={attributesData}
      breadCrumbs={[
        {
          id: "applications",
          children: "Applications",
        },
      ]}
    />
  )
}
