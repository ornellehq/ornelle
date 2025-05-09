import { createFileRoute } from "@tanstack/react-router"
import { ApplicationStatusSettings } from "../-components/application-status-settings"

export const Route = createFileRoute(
  "/(workspace)/w/$code/settings_/_layout/application-statuses",
)({
  component: ApplicationStatuses,
})

function ApplicationStatuses() {
  return <ApplicationStatusSettings />
}
