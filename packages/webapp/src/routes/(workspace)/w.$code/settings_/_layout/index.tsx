import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(workspace)/w/$code/settings_/_layout/")(
  {
    component: () => <div>Hello /(workspace)/w/$code/settings/!</div>,
  },
)
