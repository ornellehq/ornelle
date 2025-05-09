import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { Button } from "webui-library/src/button"
import EditInline from "webui-library/src/icons/edit-inline"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { useFilesBaseUrl, useUser } from "~/core/user/hooks"
import { invalidateWorkspaceInfo, useWorkspaceApi } from "~/core/workspace/api"
import { useCurrentProfile } from "~/core/workspace/hooks"
import { useWorkspace } from "~/core/workspace/workspace.context"

interface ProfileFormData {
  displayName: string
}

export const Route = createFileRoute(
  "/(workspace)/w/$code/settings_/_layout/profile",
)({
  component: ProfileSettings,
})

function ProfileSettings() {
  const user = useUser()
  const api = useWorkspaceApi()
  const profile = useCurrentProfile()
  const workspace = useWorkspace()
  const filesBaseUrl = useFilesBaseUrl()
  const existingDisplayName =
    profile.displayName || `${profile.firstName} ${profile.lastName}`

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: existingDisplayName,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    // Only update if form is dirty
    if (!isDirty) return

    await api.profile.updateProfile({
      updateProfileRequest: {
        ...(dirtyFields.displayName && {
          displayName: data.displayName.trim(),
        }),
      },
    })
    invalidateWorkspaceInfo(workspace.code)
  }

  const handleFileUpload = async (file: File) => {
    if (!file || file.size > 1024 * 512) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      await api.profile.updateProfile({
        updateProfileRequest: {
          picture: {
            base64,
            name: file.name,
            mime: file.type,
            size: file.size,
          },
        },
      })
      invalidateWorkspaceInfo(workspace.code)
    }
    reader.readAsDataURL(file)
  }

  const onGenerateEmailAddress = async () => {
    await api.profile.createEmailAddress({
      body: {},
    })
    invalidateWorkspaceInfo(workspace.code)
  }

  const [emailAddress] = profile.emailAddresses

  return (
    <div className="">
      <div className="flex">
        <div className="flex-1">Profile Settings</div>
        <form
          className="-mt-4 flex w-full max-w-lg flex-col divide-y divide-gray-50"
          onSubmit={handleSubmit(onSubmit)}
          onBlur={handleSubmit(onSubmit)}
        >
          <div className="flex items-center py-5">
            <div className="relative mr-3 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
              {profile.pictureSlug ? (
                <img
                  src={`${filesBaseUrl}${profile.pictureSlug}`}
                  alt="Current user"
                  className="h-full w-full object-contain object-center"
                />
              ) : profile.displayName ? (
                <span>{profile.displayName.substring(0, 2).toUpperCase()}</span>
              ) : (
                <span>
                  {`${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()}
                </span>
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
              <div>Profile Picture</div>
              <div className="text-gray-500 text-xs">
                Recommended max dimensions is 512 x 512px. <br /> Size cannot be
                more than 512kb
              </div>
            </div>
          </div>
          <div className="py-5">
            <div className="mb-2 text-xs">Display Name</div>
            <TextFieldInput {...register("displayName")} className="" />
          </div>
          <div className="py-5">
            <div className="mb-2 text-xs">Email</div>
            <div className="text-gray-700 text-sm">{user.email}</div>
          </div>
          <div className="py-5">
            <div className="mb-2 text-xs">Alias Email</div>
            {emailAddress ? (
              <>
                <div className="text-gray-700 text-sm">
                  {emailAddress.email}
                </div>
                <div className="mt-1 text-gray-500 text-xs">
                  Used to send emails to candidates
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                You do not have an alias email address.{" "}
                <Button
                  variant="plain"
                  className="underline"
                  onPress={onGenerateEmailAddress}
                >
                  Generate one
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
