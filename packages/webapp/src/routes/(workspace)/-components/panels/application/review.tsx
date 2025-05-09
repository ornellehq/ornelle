import { useMutation, useQuery } from "@tanstack/react-query"
import type { FormField } from "isomorphic-blocs/src/types/form"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  CreateFormRequestTypeEnum,
  type GetActivities200ResponseInner,
  GetFormsTypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import Add from "webui-library/src/icons/Add"
import CaretDown from "webui-library/src/icons/CaretDown"
import { Label } from "webui-library/src/label"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import Menu from "webui-library/src/widgets/menu"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import FormFieldsRenderer from "../../form/form-fields-renderer"
import ModalRenderer from "../../modal-renderer"
import FormEditFooterDefault from "../new-form/footer"
import FormEdit from "../new-form/form-edit"

interface FieldValues {
  formId: string
  responses: {
    id: string
    answer: unknown
    question: string
    type: FormField["type"]
  }[]
}

const textFieldTypes: FormField["type"][] = [
  "text",
  "number",
  "email",
  "url",
  "phone",
]

export interface ReviewProps {
  applicationId: string
  reviewId?: string | null
  onSuccess?(data: GetActivities200ResponseInner): void
  close(): void
}

const Review = ({ applicationId, reviewId, onSuccess, close }: ReviewProps) => {
  const api = useWorkspaceApi()
  const { control, handleSubmit, watch, setValue, formState, reset } =
    useForm<FieldValues>({
      defaultValues: {
        responses: [],
      },
    })
  const [createFormModalOpened, setCreateFormModalOpened] = useState(false)

  // Fetch review forms
  const { data: forms = [] } = useQuery({
    queryKey: [api.form.getForms.name],
    queryFn: async () => {
      return api.form.getForms({ type: GetFormsTypeEnum.Review })
    },
  })

  // Fetch existing review if reviewId is provided
  const { data: existingReview, isLoading: isLoadingReview } = useQuery({
    queryKey: [api.review.getReview.name, reviewId],
    queryFn: async () => {
      if (!reviewId) return null
      return api.review.getReview({ id: reviewId })
    },
    enabled: !!reviewId,
    onSuccess: (data) => {
      if (!data) return

      // If we have an existing review, set the form and responses
      if (data.form?.id) {
        setValue("formId", data.form.id)
      }

      if (data.responses) {
        setValue("responses", data.responses)
      }
    },
  })

  // Create review mutation
  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: async (values: FieldValues) => {
      return api.application.createReview({
        id: applicationId,
        createReviewRequest: {
          responses: values.responses,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.activity.getActivities.name, applicationId],
      })
      onSuccess?.()
      close()
    },
  })

  // Update review mutation
  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      values,
      status,
    }: { values: FieldValues; status: "Approved" | "Rejected" }) => {
      if (!reviewId) return null

      return api.review.updateReview({
        id: reviewId,
        updateReviewRequest: {
          status,
          responses: values.responses,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.activity.getActivities.name, applicationId],
      })
      onSuccess?.()
      close()
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    if (reviewId) {
      // If we have a reviewId, update the existing review with Approved status
      updateReview({ values, status: "Approved" })
    } else {
      // Otherwise create a new review
      createReview(values)
    }
  })

  const onReject = () => {
    if (reviewId) {
      handleSubmit((values) => {
        updateReview({ values, status: "Rejected" })
      })()
    } else {
      close()
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit} className="flex h-full flex-col">
        <div className="flex flex-1 flex-col gap-y-3 overflow-y-auto px-6 py-2">
          {reviewId ? (
            // If we have a reviewId, show existing review form and fields
            isLoadingReview ? (
              <div className="flex flex-col gap-4 p-4">
                <div className="h-6 w-1/3 animate-pulse rounded-md bg-gray-300" />
                <div className="h-24 animate-pulse rounded-md bg-gray-200" />
              </div>
            ) : existingReview?.form ? (
              <div className="space-y-4">
                <h2 className="font-medium text-lg">
                  {existingReview.form.name || "Review Application"}
                </h2>

                {existingReview.form.content?.json ? (
                  <Controller
                    control={control}
                    name="responses"
                    render={({ field: { value, onChange } }) => (
                      <FormFieldsRenderer
                        fields={existingReview.form.content.json as FormField[]}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                ) : (
                  <div className="py-2 text-gray-600">
                    No form fields found for this review
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2 text-gray-600">
                Could not load the review
              </div>
            )
          ) : (
            // Original form selection and fields for new reviews
            <>
              <Controller
                control={control}
                name="formId"
                rules={{
                  required: "Please select a form",
                }}
                render={({ field: { value, onChange }, fieldState }) => {
                  const selectedForm = forms.find((form) => form.id === value)

                  return (
                    <TextFieldManager className="">
                      <div className="flex w-full items-center justify-between text-left">
                        <Label className="text-gray-600">Form</Label>
                        <Button
                          variant="plain"
                          className="text-gray-600"
                          onPress={() => {
                            setCreateFormModalOpened(true)
                          }}
                        >
                          <Add width={12} />
                        </Button>
                      </div>
                      <Menu
                        triggerButton={{
                          className:
                            "w-full flex items-center border border-gray-200 rounded-md text-left h-8 px-2 leading-8",
                          children: (
                            <>
                              <span className="flex-1">
                                {selectedForm ? (
                                  <>{selectedForm.name}</>
                                ) : (
                                  "Select a form"
                                )}
                              </span>
                              <CaretDown width={12} />
                            </>
                          ),
                        }}
                        items={forms.map(({ id, name }) => {
                          return {
                            id,
                            children: name,
                          }
                        })}
                        onAction={(key) => {
                          onChange(key)
                        }}
                      />
                      {fieldState.error?.message ? (
                        <span className="-mt-1 text-red-500 text-xs">
                          {fieldState.error.message}
                        </span>
                      ) : null}
                    </TextFieldManager>
                  )
                }}
              />
              <Controller
                control={control}
                name="responses"
                render={({ field: { value, onChange } }) => {
                  const formId = watch("formId")
                  const form = forms.find((form) => form.id === formId)

                  if (!form)
                    return (
                      <div className="py-2 text-gray-600">
                        Please select a form to continue
                      </div>
                    )

                  const { json: fields } = form.content as {
                    json: FormField[]
                    version: string
                  }

                  return (
                    <FormFieldsRenderer
                      fields={fields}
                      value={value}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </>
          )}
        </div>
        <div className="flex justify-between gap-x-2 border-t px-6 py-4">
          <Button
            variant="plain"
            onPress={onReject}
            className="border-red-500 text-red-600"
          >
            Not a Fit
          </Button>
          <Button
            variant="elevated"
            onPress={() => onSubmit()}
            type="submit"
            className="px-2 [--spacing-9:1.5rem]"
          >
            {reviewId ? "Recommend" : "Submit"}
          </Button>
        </div>
      </Form>
      {createFormModalOpened ? (
        <ModalRenderer
          title="New review form"
          close={() => setCreateFormModalOpened(false)}
          componentProps={
            {
              // onSuccess: async (data) => {
              //   // close()
              //   // await queryClient.invalidateQueries({ queryKey })
              //   // selectTemplate(data)
              // },
            }
          }
        >
          <FormEdit
            submitHandler={async ({ title, fields }) => {
              const form = await api.form.createForm({
                createFormRequest: {
                  title,
                  fields,
                  description: "",
                  openings: [],
                  type: CreateFormRequestTypeEnum.Review,
                },
              })
              setValue("formId", form.id)
              setCreateFormModalOpened(false)
              await queryClient.invalidateQueries({
                queryKey: [api.form.getForms.name],
              })
            }}
            Footer={FormEditFooterDefault}
            fieldContainerProps={{
              className: "overflow-y-auto",
            }}
            className=" h-144"
            showOpenings={false}
            allowLinking={false}
          />
        </ModalRenderer>
      ) : null}
    </>
  )
}

export default Review
