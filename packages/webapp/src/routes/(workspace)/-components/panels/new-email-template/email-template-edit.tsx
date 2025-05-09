import type { Editor } from "@tiptap/react"
import type { ComponentProps, FunctionComponent } from "react"
import { useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { GetEmailTemplates200ResponseInnerTypeEnum } from "sdks/src/server-sdk"
import { FieldError } from "webui-library/src/field-error"
import { Form } from "webui-library/src/form"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { cn } from "webui-library/src/utils/cn"
import EmailTemplatesRTE from "../../email-templates-rte"
import ViewTabs from "../view-tabs"

export interface EmailTemplateFormValues {
  name: string
  subject: string
  description: string
  content: {
    html: string
    json: object
  }
  emailType: GetEmailTemplates200ResponseInnerTypeEnum
}

interface Props extends ComponentProps<typeof Form> {
  className?: string
  Footer?: FunctionComponent<{
    formState: ReturnType<typeof useForm<EmailTemplateFormValues>>["formState"]
    reset: ReturnType<typeof useForm<EmailTemplateFormValues>>["reset"]
  }>
  submitHandler: Parameters<
    ReturnType<typeof useForm<EmailTemplateFormValues>>["handleSubmit"]
  >[0]
  defaultValues?: Partial<EmailTemplateFormValues>
  isSubmitting?: boolean
  tab?: GetEmailTemplates200ResponseInnerTypeEnum
}

const EmailTemplateEdit = ({
  className,
  Footer,
  submitHandler,
  defaultValues = {},
  isSubmitting = false,
  tab = GetEmailTemplates200ResponseInnerTypeEnum.Application,
  ...formProps
}: Props) => {
  const editorRef = useRef<Editor | null>(null)

  const { watch, control, handleSubmit, formState, reset, setValue, register } =
    useForm<EmailTemplateFormValues>({
      defaultValues: {
        name: "",
        subject: "",
        description: "",
        content: {
          html: "",
          json: {},
        },
        emailType: tab,
        ...defaultValues,
      },
    })

  const [content, emailType] = watch(["content", "emailType"])
  const onSubmit = handleSubmit((values) =>
    submitHandler({ ...values, content }),
  )

  return (
    <Form
      {...formProps}
      onSubmit={onSubmit}
      className={cn("flex h-full flex-1 flex-col overflow-hidden", className)}
    >
      <div className="flex px-4">
        <ViewTabs
          view={emailType}
          setView={(view) => {
            setValue("emailType", view)
          }}
          tabs={[
            {
              id: "Application",
              children: "Application",
            },
            {
              id: "MeetingRequest",
              children: "Meeting",
            },
          ]}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-auto">
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name is required",
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => {
            return (
              <TextFieldManager
                isInvalid={invalid || !!errors.root?.message}
                aria-label="Template name"
                className="mt-4 px-2"
                isRequired
                validationBehavior="aria"
              >
                <TextFieldInput
                  autoFocus
                  placeholder="Template Name"
                  className="border-none text-2xl outline-none"
                  onChange={field.onChange}
                  disabled={isSubmitting || formState.isSubmitting}
                  value={field.value}
                />
                <FieldError className="mx-2">
                  {error?.message || errors.root?.message}
                </FieldError>
              </TextFieldManager>
            )
          }}
        />

        <div className="mx-5 hidden border-gray-100 border-b pb-3">
          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <TextFieldInput
                  variant="plain"
                  placeholder="Template description"
                  className="text-sm"
                  onChange={field.onChange}
                  value={field.value || ""}
                  disabled={isSubmitting || formState.isSubmitting}
                />
              )
            }}
          />
        </div>

        <div className="mx-5 mt-6 flex items-center gap-x-3 border-gray-100 border-b pb-3">
          <span className="text-gray-500">Subject: </span>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => {
              return (
                <TextFieldInput
                  variant="plain"
                  placeholder="Subject"
                  className="text-sm"
                  onChange={field.onChange}
                  value={field.value || ""}
                  disabled={isSubmitting || formState.isSubmitting}
                />
              )
            }}
          />
        </div>
        <div className="mx-5 py-2">
          {/* <EmailTemplatesRTE
            ref={editorRef}
            defaultContent={defaultValues.content?.html || ""}
            onChange={({ html }) => {
              setValue("content", { html, json: {} })
            }}
            editable={!(isSubmitting || formState.isSubmitting)}
            placeholder="Email body"
          /> */}
          <Controller
            control={control}
            name="content"
            disabled={isSubmitting || formState.isSubmitting}
            rules={{
              validate: (value) => {
                const div = document.createElement("div")
                div.innerHTML = value?.html ?? ""
                if (!div.textContent?.trim()) return "Body is required"
                return true
              },
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <>
                  <EmailTemplatesRTE
                    ref={editorRef}
                    defaultContent={defaultValues.content?.html || ""}
                    onChange={({ html }) => {
                      field.onChange({ html, json: {} })
                    }}
                    editable={!(isSubmitting || formState.isSubmitting)}
                    placeholder="Message"
                    emailType={emailType}
                    key={emailType}
                  />
                  {error ? (
                    <span className="mt-2 text-red-600">{error.message}</span>
                  ) : null}
                </>
              )
            }}
          />
        </div>
      </div>

      {Footer ? (
        <Footer
          formState={{
            ...formState,
            isDirty:
              formState.isDirty ||
              content.html !== formState.defaultValues?.content?.html ||
              emailType !== formState.defaultValues?.emailType,
          }}
          reset={() => {
            reset()
            editorRef.current?.commands.setContent(
              defaultValues.content?.html ?? "",
            )
          }}
        />
      ) : null}
    </Form>
  )
}

export default EmailTemplateEdit
