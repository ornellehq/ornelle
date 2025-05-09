import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import type {
  GetAttributesEntityTypesEnum,
  UpsertAttributeValuesRequestInner,
} from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { globals } from "~/core/workspace/globals"
import NewLayout from "../components/NewLayout"
import useCandidateBuiltInFields from "./built-in-fields"

interface NewCandidateFieldValues {
  firstName: string
  lastName: string
  email: string
}

const NewCandidate = () => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const form = useForm<NewCandidateFieldValues>()
  const { data: attributes = [] } = useEntityAttributes(
    "Candidate" as GetAttributesEntityTypesEnum,
  )
  const onSubmit = form.handleSubmit(async (values) => {
    const candidate = await api.candidate.createCandidate({
      createCandidateRequest: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      },
    })

    const attributeValuesBody = Object.entries(values)
      .map(([fieldName, value]) => {
        const attribute = attributes.find(
          (attribute) => attribute.id === fieldName,
        )
        if (!attribute) return null

        return {
          entityId: candidate.id,
          attributeId: attribute.id,
          data: {
            value,
          },
        }
      })
      .filter(
        (attributeValue) => !!attributeValue?.data?.value,
      ) as UpsertAttributeValuesRequestInner[]

    await api.attributeValue.upsertAttributeValues({
      upsertAttributeValuesRequestInner: attributeValuesBody,
    })

    queryClient.invalidateQueries({
      queryKey: [
        api.candidate.getCandidates.name,
        globals.filters.Candidate,
        globals.sorts,
      ],
    })

    navigate({ to: "", search: { drw: { id: "cd", e: candidate.id } } })
  })
  const fields = useCandidateBuiltInFields({ form })
  const [firstName, lastName] = form.watch(["firstName", "lastName"])
  const title = `${firstName ?? ""} ${lastName ?? ""}`.trim()

  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <h2 className="mx-6 mt-4 text-2xl text-gray-400">
        {title || "Candidate"}
      </h2>
      <NewLayout
        form={form}
        onSubmit={onSubmit}
        entityType="Candidate"
        fields={fields}
      />
    </div>
  )
}

export default NewCandidate
