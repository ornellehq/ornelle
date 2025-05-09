import { useWorkspace } from "./workspace.context"

export const useCurrentProfile = () => {
  const {
    members: [profile],
  } = useWorkspace()

  if (!profile)
    throw new Error(
      "Can't retrieve current user profile out of workspace context",
    )

  return profile
}
