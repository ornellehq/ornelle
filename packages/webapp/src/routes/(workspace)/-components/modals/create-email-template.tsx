import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  type CreateEmailTemplateRequest,
  type GetEmailTemplates200ResponseInner,
  GetEmailTemplates200ResponseInnerTypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { FieldError } from "webui-library/src/field-error"
import { Form } from "webui-library/src/form"
import { Label } from "webui-library/src/label"
import Tab from "webui-library/src/tab"
import Tabs from "webui-library/src/tabs"
import TabList from "webui-library/src/tabs-list"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import RTE from "webui-library/src/widgets/rte"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEmailTemplateVariables } from "~/core/workspace/email-template/hooks"
import { useConfiguredVariableTiptapExtension } from "~/core/workspace/tiptap/variable-extension"

interface FormFieldValues {
  name: string
  subject: string
  content: {
    json: object
    html: string
  }
}

export interface CreateEmailTemplateProps {
  onSuccess?(data: GetEmailTemplates200ResponseInner): void
}

const CreateEmailTemplate = ({ onSuccess }: CreateEmailTemplateProps) => {
  const api = useWorkspaceApi()
  const [emailType, setEmailType] =
    useState<GetEmailTemplates200ResponseInnerTypeEnum>(
      GetEmailTemplates200ResponseInnerTypeEnum.Application,
    )
  const { control, handleSubmit } = useForm<FormFieldValues>({
    defaultValues: {},
  })
  const rteContainerId = "create-email-template-rte"
  const createEmailTemplateMutation = useMutation({
    mutationFn: async (data: CreateEmailTemplateRequest) => {
      return api.emailTemplate.createEmailTemplate({
        createEmailTemplateRequest: data,
      })
    },
    onSuccess: (data) => {
      onSuccess?.(data)
    },
  })
  const onSubmit = handleSubmit(async (values) => {
    await createEmailTemplateMutation.mutate(values)
  })
  const { blocks } = useEmailTemplateVariables({ emailType })
  const VariableTiptapExtension = useConfiguredVariableTiptapExtension({
    blocks,
  })

  return (
    <Form onSubmit={onSubmit} key={emailType}>
      <div className="flex h-96 flex-col gap-y-3 overflow-hidden p-5">
        <Tabs
          selectedKey={emailType}
          onSelectionChange={(key) =>
            setEmailType(key as GetEmailTemplates200ResponseInnerTypeEnum)
          }
        >
          <TabList>
            <Tab id="application">Application</Tab>
            <Tab id="meeting">Meeting</Tab>
          </TabList>
        </Tabs>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
            // validate: (name) => {
            //   return (
            //     name.trim() || "Name is required"
            //   )
            // },
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => {
            return (
              <TextFieldManager
                isInvalid={invalid || !!errors.root?.message}
                aria-label="Name"
                className="mb-2"
                isRequired
                validationBehavior="aria"
              >
                <Label className="text-xs">Name</Label>
                <TextFieldInput
                  ref={field.ref}
                  aria-labelledby="Name"
                  autoComplete="off"
                  className="border-gray-200 shadow"
                  placeholder="A name for the saved email"
                  onChange={field.onChange}
                  value={field.value}
                  autoFocus
                />
                <FieldError>
                  {error?.message || errors.root?.message}
                </FieldError>
              </TextFieldManager>
            )
          }}
        />
        <Controller
          control={control}
          name="subject"
          rules={{
            required: "Email subject is required",
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => {
            return (
              <TextFieldManager
                isInvalid={invalid || !!errors.root?.message}
                aria-label="Subject"
                className="mb-2"
                isRequired
                validationBehavior="aria"
              >
                <Label className="text-xs">Subject</Label>
                <TextFieldInput
                  ref={field.ref}
                  aria-labelledby="Subject"
                  autoComplete="off"
                  className="border-gray-200 shadow"
                  placeholder="Email subject"
                  onChange={field.onChange}
                  value={field.value}
                />
                <FieldError>
                  {error?.message || errors.root?.message}
                </FieldError>
              </TextFieldManager>
            )
          }}
        />
        <Controller
          control={control}
          name="content"
          rules={{
            validate: (value) => {
              return !!value?.html.trim() || "Email body cannot be empty"
            },
          }}
          render={({
            field,
            fieldState: { error, invalid },
            formState: { errors },
          }) => {
            return (
              <div>
                <Label className="text-xs">Body</Label>
                <div
                  id={rteContainerId}
                  className="max-h-40 min-h-20 overflow-y-auto rounded-md border border-gray-200 p-2 shadow"
                >
                  <RTE
                    defaultContent={""}
                    onChange={(data) => {
                      field.onChange(data)
                    }}
                    editorProps={{}}
                    extensions={[VariableTiptapExtension]}
                  />
                </div>
                {invalid ? (
                  <div className="my-1 text-red-600 text-xs">
                    {error?.message || errors.root?.message}
                  </div>
                ) : null}
              </div>
            )
          }}
        />
      </div>
      <div className="flex justify-end bg-gradient-to-t from-gray-100 to-white px-5 py-3 pb-4">
        <Button
          type="submit"
          variant={"elevated"}
          className="px-3 [--spacing-9:1.5rem]"
        >
          Save
        </Button>
      </div>
    </Form>
  )
}

export default CreateEmailTemplate
