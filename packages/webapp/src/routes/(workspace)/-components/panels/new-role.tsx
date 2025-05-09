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
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { globals } from "~/core/workspace/globals.js"
import NewLayout from "./components/NewLayout.js"

interface NewRoleFormValues extends Record<string, unknown> {
  title: string
  description: {
    html: string
    json: object
  }
}

const NewRole = () => {
  const navigate = useNavigate()
  const api = useWorkspaceApi()
  const form = useForm<NewRoleFormValues>({
    defaultValues: {
      description: {
        html: "",
        json: {},
      },
    },
  })
  const { handleSubmit, control, formState, setError } = form

  const { data: attributes = [] } = useEntityAttributes(
    "Role" as GetAttributesEntityTypesEnum,
  )

  const onSubmit = handleSubmit(async (values) => {
    const res = await api.role
      .createRole({ createRoleRequest: values })
      .catch((err) => err as ResponseError | Error)

    match(res)
      .with({ id: P.string }, async (role) => {
        // queryClient.setQueryData(
        //   [api.role.getRoles.name],
        //   (data: undefined | GetRoles200ResponseInner[]) => {
        //     return [role, ...(data ?? [])]
        //   },
        // )
        // queryClient.setQueryData([api.role.getRole.name, role.id], () => {
        //   return role
        // })

        const attributeValuesBody = Object.keys(values)
          .map((fieldName) => {
            const attribute = attributes.find(
              (attribute) => attribute.id === fieldName,
            )
            if (!attribute) return null

            return {
              entityId: role.id,
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
            api.role.getRoles.name,
            globals.filters.Role,
            globals.sorts,
          ],
        })
        // queryClient.invalidateQueries({
        //   queryKey: [api.attribute.getAttributes.name, "Role"],
        // })
        navigate({ to: "", search: { drw: { id: "role", e: role.id } } })
      })
      .with({ name: P.string }, () => {
        setError("root", {
          message: "An error occurred. Please try again shortly",
        })
      })
  })

  return (
    <>
      <NewLayout
        form={form}
        onSubmit={onSubmit}
        title={{ name: "title" }}
        description={{ name: "description" }}
        entityType="Role"
        fields={[]}
      />
    </>
  )
}

export default NewRole
