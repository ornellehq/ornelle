import { useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { CreateFormRequestTypeEnum } from "sdks/src/server-sdk"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useWorkspaceParams } from "~/core/workspace/navigation"
import FormEditFooterDefault from "./footer"
import FormEdit from "./form-edit"

const NewForm = () => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const { code } = useWorkspaceParams()
  const Footer = useCallback(FormEditFooterDefault, [])

  return (
    <FormEdit
      Footer={Footer}
      submitHandler={async ({ title, fields, openings }) => {
        const form = await api.form.createForm({
          createFormRequest: {
            title,
            fields,
            description: "",
            openings,
            type: CreateFormRequestTypeEnum.Application,
          },
        })
        await queryClient.invalidateQueries({
          queryKey: [api.form.getForms.name],
        })

        navigate({ to: ".", search: { drw: { id: "fm", e: form.id } } })
      }}
    />
  )
}

export default NewForm

/**
 * fields: Field[]
 * field: {type: string; connect: custom; title: string; required: boolean; description: string; }
 */
