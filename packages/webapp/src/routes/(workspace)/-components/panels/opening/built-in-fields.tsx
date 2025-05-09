import { useQuery } from "@tanstack/react-query"
import { GetFormsTypeEnum } from "sdks/src/server-sdk"
import { useWorkspaceApi } from "~/core/workspace/api"
import type { AttributeRenderDefinition } from "../../attributes/types"

const useBuiltInFields = (
  { includeOpening } = { includeOpening: true },
): AttributeRenderDefinition[] => {
  const api = useWorkspaceApi()
  const { data: workflows = [], status: workflowsStatus } = useQuery({
    queryKey: [api.workflow.getWorkflows.name],
    queryFn: async () => {
      return await api.workflow.getWorkflows()
    },
  })
  const { data: roles = [], status: rolesStatus } = useQuery({
    queryKey: [api.role.getRoles.name],
    queryFn: async () => {
      return await api.role.getRoles()
    },
  })
  const { data: forms = [], status: formsStatus } = useQuery({
    queryKey: [api.form.getForms.name],
    queryFn: async () => {
      return await api.form.getForms({ type: GetFormsTypeEnum.Application })
    },
  })
  const loading = (
    <div className="h-2 w-20 animate-pulse rounded-md bg-gray-300" />
  )

  return [
    ...(includeOpening
      ? ([
          {
            id: "title",
            name: "Opening",
            dataType: "Text",
            type: "system",
            editable: false,
            field: {
              type: "Text",
              options: {},
            },
          },
        ] as AttributeRenderDefinition[])
      : []),
    {
      id: "roleId",
      name: "Role",
      dataType: "Select",
      type: "system",
      editable: true,
      field: {
        type: "Select",
        options: {
          items: roles.map((role) => ({
            id: role.id,
            name: role.title,
          })),
        },
      },
      transform: (id) =>
        rolesStatus === "pending"
          ? loading
          : id
            ? roles.find((role) => role.id === id)?.title ?? "Not found"
            : null,

      // ValueComponent: () => {
      //   return (
      //     <Controller
      //       control={control}
      //       name="roleId"
      //       rules={{
      //         required: "Role is required",
      //         validate: (val) => !!val?.trim() || "Role is required",
      //       }}
      //       render={({ field, formState }) => {
      //         const { value } = field
      //         const selectedRole = roles.find(({ id }) => id === value)

      //         return (
      //           <>
      //             <Menu
      //               triggerButton={{
      //                 className: `block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${selectedRole ? "" : "text-gray-300"}`,
      //                 children: selectedRole ? selectedRole.title : "Role",
      //               }}
      //               items={roles.map((role) => ({
      //                 id: role.id,
      //                 children: <>{role.title}</>,
      //               }))}
      //               className="max-h-80 overflow-y-auto"
      //               onAction={(key) => {
      //                 const id = key as string
      //                 field.onChange(id)
      //                 api.opening.updateAnOpening({
      //                   id: openingId,
      //                   updateAnOpeningRequest: {
      //                     role: id,
      //                   },
      //                 })
      //               }}
      //             />
      //             {formState.errors.roleId?.message ? (
      //               <span className="mb-1 text-red-600 text-xs">
      //                 {formState.errors.roleId.message}
      //               </span>
      //             ) : null}
      //           </>
      //         )
      //       }}
      //     />
      //   )
      // },
    },
    {
      id: "workflowId",
      name: "Process",
      dataType: "Select",
      type: "system",
      editable: true,
      field: {
        type: "Select",
        options: {
          items: workflows.map((workflow) => ({
            id: workflow.id,
            name: workflow.name,
          })),
        },
      },
      transform: (id) =>
        workflowsStatus === "pending"
          ? loading
          : id
            ? workflows.find((workflow) => workflow.id === id)?.name ??
              "Not found"
            : null,
      // ValueComponent: () => {
      //   return (
      //     <Controller
      //       control={control}
      //       name="workflowId"
      //       rules={{
      //         required: "Process is required",
      //         validate: (val) => !!val?.trim() || "Process is required",
      //       }}
      //       render={({ field, formState }) => {
      //         const { value } = field
      //         const selectedWorkflow = workflows.find(({ id }) => id === value)

      //         return (
      //           <>
      //             <Menu
      //               triggerButton={{
      //                 className: `block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${selectedWorkflow ? "" : "text-gray-300"}`,
      //                 children: selectedWorkflow
      //                   ? selectedWorkflow.name
      //                   : "Process",
      //               }}
      //               items={workflows.map((workflow) => ({
      //                 id: workflow.id,
      //                 children: <>{workflow.name}</>,
      //               }))}
      //               className="max-h-80 overflow-y-auto"
      //               onAction={(key) => {
      //                 const id = key as string
      //                 field.onChange(id)
      //                 api.opening.updateAnOpening({
      //                   id: openingId,
      //                   updateAnOpeningRequest: {
      //                     workflow: id,
      //                   },
      //                 })
      //               }}
      //             />
      //             {formState.errors.workflowId?.message ? (
      //               <span className="mb-1 text-red-600 text-xs">
      //                 {formState.errors.workflowId.message}
      //               </span>
      //             ) : null}
      //           </>
      //         )
      //       }}
      //     />
      //   )
      // },
    },
    {
      id: "formId",
      name: "Form",
      dataType: "Select",
      type: "system",
      editable: true,
      field: {
        type: "Select",
        options: {
          items: forms.map((form) => ({
            id: form.id,
            name: form.name,
          })),
        },
      },
      transform: (id) =>
        formsStatus === "pending"
          ? loading
          : id
            ? forms.find((form) => form.id === id)?.name ?? ""
            : null,
      // ValueComponent: () => {
      //   return (
      //     <Controller
      //       control={control}
      //       name="formId"
      //       render={({ field, formState }) => {
      //         const { value } = field
      //         const selectedForm = forms.find(({ id }) => id === value)

      //         return (
      //           <>
      //             <Menu
      //               triggerButton={{
      //                 className: `block h-9 flex-1 rounded px-2 text-left leading-9 hover:bg-gray-50 ${selectedForm ? "" : "text-gray-300"}`,
      //                 children: selectedForm ? selectedForm.name : "form",
      //               }}
      //               items={forms.map((form) => ({
      //                 id: form.id,
      //                 children: <>{form.name}</>,
      //               }))}
      //               className="max-h-80 overflow-y-auto"
      //               onAction={(key) => {
      //                 const id = key as string
      //                 field.onChange(id)
      //                 api.opening.updateAnOpening({
      //                   id: openingId,
      //                   updateAnOpeningRequest: {
      //                     form: id,
      //                   },
      //                 })
      //               }}
      //             />
      //             {formState.errors.workflowId?.message ? (
      //               <span className="mb-1 text-red-600 text-xs">
      //                 {formState.errors.workflowId.message}
      //               </span>
      //             ) : null}
      //           </>
      //         )
      //       }}
      //     />
      //   )
      // },
    },
  ]
}

export default useBuiltInFields
