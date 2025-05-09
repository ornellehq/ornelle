import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import type {
  GetAttributesEntityTypesEnum,
  ResponseError,
  UpsertAttributeValuesRequestInner,
} from "sdks/src/server-sdk"
import { P, match } from "ts-pattern"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks.js"
import { globals } from "~/core/workspace/globals.js"
import NewLayout from "../components/NewLayout.js"
import useBuiltInFields from "./built-in-fields.js"

interface NewOpeningFields {
  title: string
  description: { html: string; json: object }
  roleId: string
  workflowId: string
  formId: string
}

interface Props {
  role?: string
}

const NewOpening = ({ role }: Props) => {
  const navigate = useNavigate()
  const api = useWorkspaceApi()
  const form = useForm<NewOpeningFields>({
    defaultValues: {
      ...(role ? { roleId: role } : {}),
      description: {
        html: "",
        json: {},
      },
    },
  })
  const { handleSubmit, setError, control } = form
  const { data: attributes = [] } = useEntityAttributes(
    "Opening" as GetAttributesEntityTypesEnum,
  )
  const onSubmit = handleSubmit(async (values) => {
    const result = await api.opening
      .createOpening({
        createOpeningRequest: {
          ...values,
          role: values.roleId,
          workflow: values.workflowId,
          form: values.formId,
        },
      })
      .catch((err) => err as ResponseError | Error)
    match(result)
      .with({ id: P.string }, async (opening) => {
        const attributeValuesBody = Object.keys(values)
          .map((fieldName) => {
            const attribute = attributes.find(
              (attribute) => attribute.id === fieldName,
            )
            if (!attribute) return null

            return {
              entityId: opening.id,
              attributeId: attribute.id,
              data: {
                value: values[fieldName],
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
            api.opening.getOpenings.name,
            globals.filters.Opening,
            globals.sorts,
          ],
        })
        // queryClient.setQueryData(
        //   [api.opening.getOpening.name, opening.id],
        //   () => opening,
        // )
        // queryClient.setQueryData(
        //   [api.opening.getOpenings.name, opening.id],
        //   (openings: Opening[] = []) => [opening, ...openings],
        // )
        navigate({ to: "", search: { drw: { id: "op", e: opening.id } } })
      })
      .with({ name: P.string }, () => {
        setError("root", {
          message: "An error occurred. Please try again shortly",
        })
      })
  })

  const builtInFields = useBuiltInFields({ includeOpening: false })

  return (
    <NewLayout<NewOpeningFields>
      form={form}
      onSubmit={onSubmit}
      title={{
        name: "title",
      }}
      description={{
        name: "description",
      }}
      entityType="Opening"
      fields={builtInFields}
    />
  )
}

export default NewOpening
