import { Outlet, createFileRoute } from "@tanstack/react-router"
import SettingsNav from "./-components/settings-nav"

export const Route = createFileRoute("/(workspace)/w/$code/settings_/_layout")({
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <>
      <SettingsNav />
      <main className="flex h-full flex-1 justify-center overflow-y-auto bg-white p-5 md:p-10 xl:p-16">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
    </>
  )
}
