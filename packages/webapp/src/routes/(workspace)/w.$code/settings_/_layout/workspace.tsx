import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import EditInline from "webui-library/src/icons/edit-inline"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { useFilesBaseUrl } from "~/core/user/hooks"
import { invalidateWorkspaceInfo, useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspace } from "~/core/workspace/workspace.context"

interface WorkspaceFormData {
  name: string
  url: string
}

export const Route = createFileRoute(
  "/(workspace)/w/$code/settings_/_layout/workspace",
)({
  component: WorkspaceSettings,
})

function WorkspaceSettings() {
  const navigate = useNavigate()
  const api = useWorkspaceApi()
  const workspace = useWorkspace()
  const filesBaseUrl = useFilesBaseUrl()

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<WorkspaceFormData>({
    defaultValues: {
      name: workspace.name,
      url: workspace.url,
    },
  })

  const onSubmit = async (data: WorkspaceFormData) => {
    // Only update if form is dirty and send only changed fields
    if (!isDirty) return

    const updatedWorkspace = await api.workspace.updateWorkspace({
      updateWorkspaceRequest: {
        ...(dirtyFields.name && { name: data.name.trim() }),
        ...(dirtyFields.url && { url: data.url.trim() }),
      },
    })

    // If URL was changed, update the browser URL
    if (dirtyFields.url && updatedWorkspace.url !== workspace.url) {
      // Navigate to the new workspace URL
      await navigate({
        to: "/w/$code/settings/workspace",
        params: { code: updatedWorkspace.url },
      })
    } else {
      await invalidateWorkspaceInfo(workspace.code)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file || file.size > 1024 * 512) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      await api.workspace.updateWorkspace({
        updateWorkspaceRequest: {
          logo: {
            base64,
            name: file.name,
            mime: file.type,
            size: file.size,
          },
        },
      })
      await invalidateWorkspaceInfo(workspace.code)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="">
      <div className="flex">
        <div className="flex-1">General</div>
        <form
          className="-mt-4 flex w-full max-w-lg flex-col divide-y divide-gray-50"
          onSubmit={handleSubmit(onSubmit)}
          onBlur={handleSubmit(onSubmit)}
        >
          <div className="flex items-center py-5">
            <div className="relative mr-3 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
              {workspace.logoSlug ? (
                <img
                  src={`${filesBaseUrl}${workspace.logoSlug}`}
                  alt="Workspace logo"
                  className="h-full w-full object-contain object-center"
                />
              ) : (
                <span>{workspace.name.substring(0, 2)}</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0"
                  accept="image/*"
                  onChange={(ev) => {
                    const file = ev.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
                <EditInline className="text-white" />
              </div>
            </div>
            <div>
              <div>Logo</div>
              <div className="text-gray-500 text-xs">
                Recommended max dimensions is 512 x 512px. <br /> Size cannot be
                more than 512kb
              </div>
            </div>
          </div>
          <div className="py-5">
            <div className="mb-2 text-xs">Name</div>
            <TextFieldInput {...register("name")} className="" />
          </div>
          <div className="py-5">
            <div className="mb-2 text-xs">URL</div>
            <TextFieldInput {...register("url")} className="" />
          </div>
        </form>
      </div>
    </div>
  )
}
