import { useQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "webui-library/src/button"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import { useSignOut, useUser } from "~/core/user/hooks"
import { workspaceApi } from "~/core/workspace/api"
import WelcomeLayout from "../-components/WelcomeLayout"
import WelcomeTitle from "../-components/WelcomeTitle"

export const Route = createFileRoute("/(user)/u/workspaces/")({
  component: Workspaces,
})

function Workspaces() {
  const signout = useSignOut()
  const email = useUser()?.email
  const { data } = useQuery({
    queryKey: [workspaceApi.createWorkspace.name],
    queryFn: () => workspaceApi.getWorkspaces(),
    initialData: [],
  })

  return (
    <WelcomeLayout>
      <WelcomeTitle>
        Your Workspaces
        <div className="mt-2 text-gray-500 text-sm">
          Select a workspace to continue or create a new one
        </div>
      </WelcomeTitle>

      <div className="mt-6 flex flex-col gap-y-4">
        <ListBox className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {data.map(({ id, url, name }) => (
            <ListBoxItem
              href={`/w/${url}`}
              key={id}
              className="flex flex-col gap-y-1 px-4 py-3 hover:bg-gray-50"
            >
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-gray-500 text-sm">app.ats.com/{url}</div>
            </ListBoxItem>
          ))}
        </ListBox>

        <Link
          to="/u/workspaces/create"
          className="flex h-12 items-center justify-center rounded-lg bg-neutral-100 text-black hover:bg-neutral-200"
        >
          Create a workspace
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-y-2 text-left text-[13px] text-slate-400">
        <div className="mb-2 text-gray-500 text-xs">{email}</div>
        <Button
          variant="plain"
          className="self-start text-left text-inherit hover:bg-transparent"
          onPress={async () => {
            await signout()
          }}
        >
          Sign out
        </Button>
      </div>
    </WelcomeLayout>
  )
}
