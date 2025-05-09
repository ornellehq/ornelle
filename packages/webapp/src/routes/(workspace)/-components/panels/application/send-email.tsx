import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
  type CreateApplication200Response,
  type CreateMessage201Response,
  CreateMessageRequest1TypeEnum,
  type GetEmailTemplates200ResponseInner,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import { Label } from "webui-library/src/label"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useCurrentProfile } from "~/core/workspace/hooks"
import EmailTemplatesRTE from "../../email-templates-rte"

interface FieldValues {
  templateId: string
  from: {
    email: string
    name: string
  }
  to: string
  subject: string
  body: { json: object; html: string }
}

interface SendEmailProps {
  application: CreateApplication200Response
  onSuccess?(data: CreateMessage201Response): void
  close(): void
  template?: GetEmailTemplates200ResponseInner
}

const SendEmail = ({
  application,
  onSuccess,
  close,
  template,
}: SendEmailProps) => {
  const applicationId = application.id
  const { firstName, lastName } = useCurrentProfile()
  const api = useWorkspaceApi()
  const { control, handleSubmit, formState } = useForm<FieldValues>({
    defaultValues: {
      to: "candidate",
      body: template?.content,
      subject: template?.subject,
    },
  })

  const { mutate: sendEmail, isPending } = useMutation({
    mutationFn: async (values: FieldValues) => {
      return api.application.createMessage({
        id: applicationId,
        createMessageRequest1: {
          type: CreateMessageRequest1TypeEnum.EmailOutbound,
          subject: values.subject,
          content: values.body.html,
          ccEmails: [],
          bccEmails: [],
        },
      })
    },
    onSuccess: (data) => {
      onSuccess?.(data)
      close()
    },
  })

  const onSubmit = handleSubmit((values) => {
    sendEmail(values)
  })

  return (
    <Form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-y-2.5 overflow-y-auto px-6 py-2">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center">
            <span className="w-16 text-gray-600">From: </span>
            <span>
              {firstName} {lastName}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-16 text-gray-600">To: </span>
            <span>{application.candidate.email}</span>
          </div>
          <Controller
            control={control}
            name="subject"
            rules={{
              required: "Subject is required",
              validate: (val) =>
                !val || val.length < 2 ? "Subject is required" : true,
            }}
            render={({ field, fieldState }) => {
              return (
                <TextFieldManager className="">
                  <div className="flex w-full items-center text-left">
                    <Label className="w-16 text-gray-600">Subject:</Label>
                    <TextFieldInput
                      autoFocus
                      value={field.value}
                      className="h-8 flex-1 border-gray-200 border-gray-200/70 px-1 leading-8 outline-none focus:outline-none"
                      onChange={(ev) => {
                        field.onChange(ev.target.value)
                      }}
                      placeholder="Follow up..."
                    />
                  </div>
                  {fieldState.error?.message ? (
                    <span className="mt-1 text-red-600 text-xs">
                      {fieldState.error?.message}
                    </span>
                  ) : null}
                </TextFieldManager>
              )
            }}
          />
          <Controller
            control={control}
            name="body"
            rules={{
              required: "Subject is required",
              validate: (val) =>
                !val || val.html.length < 2 ? "Subject is required" : true,
            }}
            render={({ field, fieldState }) => {
              return (
                <div className="">
                  <div className="mb-1 text-gray-600">Body</div>
                  <EmailTemplatesRTE
                    placeholder="Email body"
                    defaultContent={field.value?.html}
                    editorProps={{
                      attributes: {
                        class:
                          "max-w-full min-h-72 border-t border-gray-100 rounded-none py-1",
                      },
                    }}
                    onChange={(data) => {
                      field.onChange(data)
                    }}
                  />
                  {fieldState.error?.message ? (
                    <span className="mt-1 text-red-600 text-xs">
                      {fieldState.error?.message}
                    </span>
                  ) : null}
                </div>
              )
            }}
          />
        </div>
      </div>
      <div className="flex shrink-0 justify-end gap-x-4 border-gray-100 border-t px-6 py-4">
        <Button
          type="submit"
          variant={"elevated"}
          className="px-2 [--spacing-9:1.5rem]"
          isDisabled={formState.isSubmitting}
        >
          {isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </Form>
  )
}

export default SendEmail
