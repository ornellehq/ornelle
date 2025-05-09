import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import type {
  ResponseError,
  UpdateEmailTemplateRequestEmailTypeEnum,
} from "sdks/src/server-sdk"
import { toast } from "sonner"
import { Button } from "webui-library/src/button"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { NewLayoutFooter } from "./components/NewLayout"
import EmailTemplateEdit, {
  type EmailTemplateFormValues,
} from "./new-email-template/email-template-edit"

interface Props {
  id: string
}

const EmailTemplate = ({ id }: Props) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const queryKey = [api.emailTemplate.getEmailTemplate?.name, id]
  const { data: emailTemplate, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      return api.emailTemplate.getEmailTemplate({
        id,
      })
    },
  })

  const Footer: NonNullable<
    React.ComponentProps<typeof EmailTemplateEdit>["Footer"]
  > = ({ formState, reset }) =>
    formState.isDirty ? (
      <NewLayoutFooter
        formState={formState}
        button={{ children: formState.isSubmitting ? "Saving" : "Save" }}
      >
        <Button
          type="button"
          variant="plain"
          className="mr-2 px-2 text-gray-500 hover:text-gray-700"
          onPress={() => reset()}
        >
          Reset
        </Button>
      </NewLayoutFooter>
    ) : null

  const handleSubmit = async (data: EmailTemplateFormValues) => {
    try {
      await api.emailTemplate.updateEmailTemplate({
        id,
        updateEmailTemplateRequest: {
          name: data.name,
          description: data.description,
          content: data.content,
          subject: data.subject,
          emailType:
            data.emailType as unknown as UpdateEmailTemplateRequestEmailTypeEnum,
        },
      })

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [api.emailTemplate.getEmailTemplates.name],
        }),
        queryClient.invalidateQueries({
          queryKey,
        }),
      ])

      toast.success("Email template updated successfully")
      navigate({ to: "" })
    } catch (error) {
      const err = error as Error | ResponseError
      if ("response" in err) {
        const json = await err.response.json()
        toast.error(json.message || "Failed to update email template")
      } else {
        toast.error(err?.message ?? "An error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="h-full 3xl:w-[36rem] w-[28rem] 2xl:w-[32rem]">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          Loading...
        </div>
      ) : !emailTemplate ? (
        <div className="flex h-full items-center justify-center">
          Email template not found
        </div>
      ) : (
        <EmailTemplateEdit
          Footer={Footer}
          submitHandler={handleSubmit}
          defaultValues={{
            name: emailTemplate.name,
            description: emailTemplate.description || "",
            subject: emailTemplate.subject,
            emailType: emailTemplate.type,
            ...(emailTemplate.content
              ? {
                  content: emailTemplate.content as {
                    html: string
                    json: object
                  },
                }
              : {}),
          }}
        />
      )}
    </div>
  )
}

export default EmailTemplate
