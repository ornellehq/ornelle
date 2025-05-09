import { useNavigate } from "@tanstack/react-router"
import { type ComponentProps, useCallback } from "react"
import {
  GetEmailTemplates200ResponseInnerTypeEnum,
  type ResponseError,
} from "sdks/src/server-sdk"
import { toast } from "sonner"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import type { NewEmailTemplateTab } from "~/core/workspace/drawer/util"
import { useWorkspace } from "~/core/workspace/workspace.context"
import { NewLayoutFooter } from "../components/NewLayout"
import EmailTemplateEdit, {
  type EmailTemplateFormValues,
} from "./email-template-edit"

const NewEmailTemplate = ({ tb }: { tb?: NewEmailTemplateTab }) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const workspace = useWorkspace()

  const Footer = useCallback<
    NonNullable<ComponentProps<typeof EmailTemplateEdit>["Footer"]>
  >(({ formState }) => {
    return (
      <>
        <NewLayoutFooter formState={formState} />
      </>
    )
  }, [])

  const handleSubmit = async (data: EmailTemplateFormValues) => {
    try {
      const template = await api.emailTemplate.createEmailTemplate({
        createEmailTemplateRequest: {
          name: data.name,
          description: data.description,
          content: data.content,
          emailType: data.emailType,
          subject: data.subject,
        },
      })

      await queryClient.invalidateQueries({
        queryKey: [api.emailTemplate.getEmailTemplates.name],
      })

      navigate({
        to: ".",
        params: { code: workspace.url },
        search: {
          drw: {
            id: "et",
            e: template.id,
          },
        },
      })
    } catch (error) {
      const err = error as Error
      if ("response" in err) {
        const json = await (err as ResponseError).response.json()
        toast.error(json.message || "Failed to create email template")
      } else {
        toast.error(err?.message ?? "An error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="h-full 3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]">
      <EmailTemplateEdit
        Footer={Footer}
        submitHandler={handleSubmit}
        defaultValues={{
          name: "New Message Template",
          description: "",
          content: {
            html: "",
            json: {},
          },
        }}
        {...(tb
          ? {
              tab:
                tb === "m"
                  ? GetEmailTemplates200ResponseInnerTypeEnum.MeetingRequest
                  : GetEmailTemplates200ResponseInnerTypeEnum.Application,
            }
          : {})}
      />
    </div>
  )
}

export default NewEmailTemplate
