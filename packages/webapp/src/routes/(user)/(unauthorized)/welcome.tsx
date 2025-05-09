import { Outlet, createFileRoute } from "@tanstack/react-router"
import WelcomeLayout from "../-components/WelcomeLayout.js"

export const Route = createFileRoute("/(user)/(unauthorized)/welcome")({
  component: Welcome,
})

function Welcome() {
  return (
    <WelcomeLayout>
      <Outlet />
    </WelcomeLayout>
  )
}
