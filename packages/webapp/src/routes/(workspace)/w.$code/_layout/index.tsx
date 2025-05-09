import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(workspace)/w/$code/_layout/")({
  component: () => <div>Hello /(workspace)/w/$code/_layout/!</div>,
  loader: async ({ params }) => {
    throw redirect({ to: "/w/$code/applications", params })
  },
})
