import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
  type CreateMessage201Response,
  CreateMessageRequest1TypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import RTE from "webui-library/src/widgets/rte"
import { useWorkspaceApi } from "~/core/workspace/api"

interface FieldValues {
  body: {
    json: object
    html: string
  }
}

export interface LeaveANoteProps {
  entityId: string
  onSuccess?(data: CreateMessage201Response): void
  close?(): void
}

const LeaveANote = ({ entityId, onSuccess, close }: LeaveANoteProps) => {
  const api = useWorkspaceApi()
  const { control, handleSubmit, formState } = useForm<FieldValues>()

  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: async (values: FieldValues) => {
      return api.application.createMessage({
        id: entityId,
        createMessageRequest1: {
          type: CreateMessageRequest1TypeEnum.InternalMessage,
          content: values.body.html,
        },
      })
    },
    onSuccess: (data) => {
      onSuccess?.(data)
      close?.()
    },
  })

  const onSubmit = handleSubmit((values) => {
    createMessage(values)
  })

  return (
    <Form onSubmit={onSubmit} className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col gap-y-2.5 overflow-y-auto px-6 py-2">
        <div className="flex flex-col gap-y-3">
          <Controller
            control={control}
            name="body"
            rules={{
              required: "Note content is required",
              validate: (val) =>
                !val || val.html.length < 2 ? "Note content is required" : true,
            }}
            render={({ field, fieldState }) => (
              <div className="">
                {/* <div className="mb-1 text-gray-600">Note</div> */}
                <RTE
                  onChange={({ json, html }) => field.onChange({ json, html })}
                  placeholder="Enter your note"
                  autofocus
                  editorProps={{
                    attributes: {
                      class: "max-w-full min-h-56 rounded-none py-1",
                    },
                  }}
                />
                {fieldState.error?.message ? (
                  <span className="mt-1 text-red-600 text-xs">
                    {fieldState.error?.message}
                  </span>
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex w-full justify-end gap-x-4 border-gray-100 border-t bg-gray-50 px-6 pt-3 pb-4">
        {/* <Button
          type="button"
          variant="plain"
          className="text-gray-500 [--spacing-9:1.5rem]"
          isDisabled={formState.isSubmitting}
          onPress={close}
        >
          Cancel
        </Button> */}
        <Button
          type="submit"
          variant="elevated"
          className="px-2 [--spacing-9:1.5rem]"
          isDisabled={formState.isSubmitting}
        >
          {isPending ? "Adding..." : "Add Note"}
        </Button>
      </div>
    </Form>
  )
}

export default LeaveANote
