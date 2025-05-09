import { useParams } from "@tanstack/react-router"

export const useWorkspaceParams = () =>
  useParams({ from: "/(workspace)/w/$code" })
