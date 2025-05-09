import { useQuery } from "@tanstack/react-query"
import type { FormField } from "isomorphic-blocs/src/types/form"
import type { ReactNode } from "react"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import {
  type GetAttributes200ResponseInner,
  GetAttributes200ResponseInnerDataTypeEnum,
  GetAttributes200ResponseInnerEntityTypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import X from "webui-library/src/icons/X"
import Menu from "webui-library/src/widgets/menu"
import { useWorkspaceApi } from "~/core/workspace/api"
import BuiltInFields from "../../attributes/built-in-fields"
import EntityFields from "../../attributes/entity-fields"
import { NewLayoutFooter } from "../components/NewLayout"

interface NewApplicationFields {
  candidateId: string
  openingId: string
}

const formFieldDataTypeToAttributeMap: Record<
  FormField["type"],
  GetAttributes200ResponseInnerDataTypeEnum
> = {
  text: GetAttributes200ResponseInnerDataTypeEnum.Text,
  email: GetAttributes200ResponseInnerDataTypeEnum.Email,
  number: GetAttributes200ResponseInnerDataTypeEnum.Number,
  file: GetAttributes200ResponseInnerDataTypeEnum.File,
  url: GetAttributes200ResponseInnerDataTypeEnum.Url,
  phone: GetAttributes200ResponseInnerDataTypeEnum.Phone,
  select: GetAttributes200ResponseInnerDataTypeEnum.Select,
  date: GetAttributes200ResponseInnerDataTypeEnum.Date,
}

const NewApplication = () => {
  const api = useWorkspaceApi()
  const form = useForm<NewApplicationFields>({
    defaultValues: {},
  })
  const { data: candidates = [] } = useQuery({
    queryKey: [api.candidate.getCandidates.name],
    queryFn: async () => api.candidate.getCandidates(),
  })
  const { data: openings = [] } = useQuery({
    queryKey: [api.opening.getOpenings.name],
    queryFn: async () => api.opening.getOpenings(),
  })
  const { data: forms = [] } = useQuery({
    queryKey: [api.form.getForms.name],
    queryFn: async () => api.form.getForms(),
  })
  const selectedOpeningId = form.watch("openingId")
  const selectedOpening = openings.find(({ id }) => id === selectedOpeningId)
  const openingForm = forms.find(({ id }) => id === selectedOpening?.formId)
  const builtInFields = [
    {
      id: "opening",
      name: "Opening",
      ValueComponent: () => {
        return (
          <Controller
            control={form.control}
            name="openingId"
            rules={{
              required: "An opening is required",
            }}
            render={({ field, formState }) => {
              const value = field.value
              const selectedOpening = openings.find(({ id }) => value === id)

              return (
                <>
                  <Menu
                    triggerButton={{
                      className: `block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${selectedOpening ? "" : "text-gray-300"}`,
                      children: selectedOpening
                        ? selectedOpening.title
                        : "Opening",
                    }}
                    items={openings.map(({ id, title }) => ({
                      id,
                      children: title,
                    }))}
                    className="max-h-80 overflow-y-auto"
                    onAction={(key) => {
                      const id = key as string
                      field.onChange(id)
                    }}
                  />
                  {formState.errors.openingId?.message ? (
                    <span className="mb-1 text-red-600 text-xs">
                      {formState.errors.openingId.message}
                    </span>
                  ) : null}
                </>
              )
            }}
          />
        )
      },
    },
    {
      id: "candidate",
      name: "Candidate",
      ValueComponent: () => {
        return (
          <Controller
            control={form.control}
            name="candidateId"
            // rules={{
            //   required: "An opening is required",
            // }}
            render={({ field, formState }) => {
              const value = field.value
              const selectedCandidate = candidates.find(
                ({ id }) => value === id,
              )

              return (
                <div className="flex flex-1">
                  <Menu
                    triggerButton={{
                      className: `flex-1 block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${selectedCandidate ? "" : "text-gray-300"}`,
                      children: selectedCandidate
                        ? `${selectedCandidate.firstName} ${selectedCandidate.lastName}`
                        : "Candidate (Optional)",
                    }}
                    items={candidates.map(({ id, firstName, lastName }) => ({
                      id,
                      children: (
                        <>
                          {firstName} {lastName}
                        </>
                      ),
                    }))}
                    className="max-h-80 overflow-y-auto"
                    onAction={(key) => {
                      const id = key as string
                      field.onChange(id)
                    }}
                  />
                  {selectedCandidate ? (
                    <Button
                      variant="plain"
                      className="px-2"
                      onPress={() => {
                        field.onChange(undefined)
                      }}
                    >
                      <X width={12} />
                    </Button>
                  ) : null}
                  {formState.errors.candidateId?.message ? (
                    <span className="mb-1 text-red-600 text-xs">
                      {formState.errors.candidateId.message}
                    </span>
                  ) : null}
                </div>
              )
            }}
          />
        )
      },
    },
  ]
  const selectedCandidateId = form.watch("candidateId")
  const selectedCandidate = candidates.find(
    ({ id }) => id === selectedCandidateId,
  )
  const onSubmit = form.handleSubmit(async () => {})

  return (
    <Form
      onSubmit={onSubmit}
      className="flex w-[35rem] flex-1 flex-col gap-y-3"
    >
      <h2 className="mx-6 mt-4 border-none text-2xl outline-none">
        {selectedCandidate ? (
          `${selectedCandidate.firstName} ${selectedCandidate.lastName}`
        ) : (
          <span className="text-gray-300">Candidate</span>
        )}
      </h2>
      <div className="flex flex-1 flex-col gap-y-1 px-5">
        <BuiltInFields fields={builtInFields} />
        {openingForm ? (
          <EntityFields
            form={form as unknown as UseFormReturn<Record<string, ReactNode>>}
            attributes={(
              openingForm?.content as {
                json: FormField[]
                version: string
              }
            ).json
              .filter((field) => {
                if (selectedCandidateId) {
                  return (
                    !field.attributeLinked?.id ||
                    !["firstName", "lastName", "email"].includes(
                      field.attributeLinked?.id,
                    )
                  )
                }
                return true
              })
              .map((field) => {
                return {
                  id: field.id,
                  name: field.name,
                  dataType: formFieldDataTypeToAttributeMap[field.type],
                  updatedAt: openingForm.updatedAt,
                  createdAt: openingForm.createdAt,
                  workspaceId: openingForm.workspaceId,
                  creatorId: "",
                  builtIn: false,
                  entityType:
                    GetAttributes200ResponseInnerEntityTypeEnum.Application,
                  // entityType: "Application",
                } as GetAttributes200ResponseInner
              })}
          />
        ) : null}
      </div>
      <NewLayoutFooter formState={form.formState} />
    </Form>
  )
}

export default NewApplication
