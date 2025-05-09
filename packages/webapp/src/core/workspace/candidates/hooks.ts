import { useQuery } from "@tanstack/react-query"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "../api"

export const useCandidatesAttributes = () => {
  const api = useWorkspaceApi()
  const { data: attributesData } = useQuery({
    queryKey: [api.attribute.getAttributes.name, "Candidate"],
    queryFn: () => {
      return api.attribute.getAttributes({
        entityTypes: [GetAttributesEntityTypesEnum.Candidate],
      })
    },
  })

  return { data: attributesData ?? [] }
}
