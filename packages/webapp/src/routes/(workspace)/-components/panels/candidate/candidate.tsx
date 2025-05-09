import { useQuery } from "@tanstack/react-query"
import { type FieldValues, useForm } from "react-hook-form"
import type { CreateCandidate200Response } from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useSyncEntityForm } from "~/core/workspace/entities/hooks"
import { globals } from "~/core/workspace/globals"
import EntityLayout from "../components/entity-layout"
import useCandidateBuiltInFields from "./built-in-fields"

interface Props {
  id: string
}

const CandidateWithData = ({
  candidate,
}: { candidate: CreateCandidate200Response }) => {
  const api = useWorkspaceApi()
  const { firstName, lastName, id } = candidate
  const title = `${firstName} ${lastName}`
  const form = useForm<FieldValues>({
    defaultValues: candidate,
  })
  const builtInFields = useCandidateBuiltInFields()
  const invalidateCandidate = () => {
    queryClient.invalidateQueries({
      queryKey: [api.candidate.getCandidate.name, id],
    })
    queryClient.invalidateQueries({
      queryKey: [api.candidate.getCandidates, globals.filters, globals.sorts],
    })
  }
  useSyncEntityForm({ form, data: candidate })

  return (
    <EntityLayout
      id={id}
      title={title}
      form={form}
      entityType="Candidate"
      builtInAttributes={builtInFields}
      updateHandlers={{
        firstName: async (data) => {
          if (typeof data.value === "string") {
            await api.candidate.updateACandidate({
              id,
              updateACandidateRequest: {
                firstName: data.value,
              },
            })
            invalidateCandidate()
          }
        },
        lastName: async (data) => {
          if (typeof data.value === "string") {
            await api.candidate.updateACandidate({
              id,
              updateACandidateRequest: {
                lastName: data.value,
              },
            })
            invalidateCandidate()
          }
        },
        email: async (data) => {
          if (typeof data.value === "string") {
            await api.candidate.updateACandidate({
              id,
              updateACandidateRequest: {
                email: data.value,
              },
            })
            invalidateCandidate()
          }
        },
      }}
    />
  )
}

const Candidate = ({ id }: Props) => {
  const api = useWorkspaceApi()
  const { data: candidate } = useQuery({
    queryKey: [api.candidate.getCandidate, id],
    queryFn: async () => api.candidate.getCandidate({ id }),
  })
  if (!candidate)
    return <div className="3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]" />

  return <CandidateWithData candidate={candidate} />
}

export default Candidate
