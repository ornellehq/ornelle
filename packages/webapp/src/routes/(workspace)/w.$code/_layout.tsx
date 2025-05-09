import { Outlet, createFileRoute } from "@tanstack/react-router"
import Main from "../-components/main"
import Sidebar from "../-components/side-bar"

export const Route = createFileRoute("/(workspace)/w/$code/_layout")({
  component: () => (
    <>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </>
  ),
})
