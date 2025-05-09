import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import type { FormState, UseFormReset, UseFormReturn } from "react-hook-form"
import { UpdateFormRequestOpeningsInnerOperationEnum } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import FormEdit from "./new-form/form-edit"
import type { FormFieldValues } from "./new-form/utils"

interface Props {
  id: string
}

const Form = ({ id }: Props) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const queryKey = [api.form.getForm.name, id]
  const { data: form } = useQuery({
    queryKey,
    queryFn: () => {
      return api.form.getForm({ id })
    },
  })

  const Footer = useCallback(
    ({
      formState,
      reset,
    }: {
      formState: FormState<FormFieldValues>
      reset: UseFormReset<FormFieldValues>
    }) => {
      return formState.isDirty ? (
        <div className="flex items-center border-gray-200 border-t border-solid bg-gray-50 px-4 py-3">
          <div className="flex-1" />
          <div>
            <Button
              variant="plain"
              className="mr-2 px-2"
              onPress={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="elevated"
              className="px-2 [--spacing-9:1.5rem]"
            >
              Save
            </Button>
          </div>
        </div>
      ) : null
    },
    [],
  )

  if (!form) return

  const submitHandler = async (
    values: FormFieldValues,
    hookForm: UseFormReturn<FormFieldValues>,
  ) => {
    const disconnectedOpenings = [
      ...values.openings,
      ...form.openings.map((opening) => opening.id),
    ].filter((id, index, arr) => {
      if (index < form.openings.length && index === arr.lastIndexOf(id))
        return true

      return false
    })
    const connectedOpenings = values.openings.filter((id) =>
      form.openings.every((opening) => opening.id !== id),
    )

    const updatedForm = await api.form.updateForm({
      id,
      updateFormRequest: {
        title: values.title,
        openings: [
          ...disconnectedOpenings.map((id) => ({
            id,
            operation: UpdateFormRequestOpeningsInnerOperationEnum.Disconnect,
          })),
          ...connectedOpenings.map((id) => ({
            id,
            operation: UpdateFormRequestOpeningsInnerOperationEnum.Connect,
          })),
        ],
        fields: values.fields,
      },
    })

    hookForm.reset({
      title: updatedForm.name,
      openings: updatedForm.openings.map((opening) => opening.id),
      fields: updatedForm.content.json,
    })

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [api.form.getForms.name],
      }),
      queryClient.invalidateQueries({
        queryKey: [api.form.getForm.name, id],
      }),
    ])

    // navigate({ to: ".", search: { drw: { id: "fm", e: id } } })
  }

  return !form ? (
    <>Loading</>
  ) : (
    <FormEdit
      className="w-[30rem]"
      submitHandler={submitHandler}
      defaultValues={{
        title: form.name,
        openings: form.openings.map((opening) => opening.id),
        fields: form.content.json,
      }}
      Footer={Footer}
    />
  )
}

export default Form
