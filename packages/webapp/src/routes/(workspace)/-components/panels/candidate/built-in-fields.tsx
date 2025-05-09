import { useMemo } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { TextFieldInput } from "webui-library/src/text-field-input"
import type { AttributeRenderDefinition } from "../../attributes/types"

const Renderer = ({
  form,
}: {
  form: UseFormReturn<{ firstName: string; lastName: string; email: string }>
}) => {
  return (
    <Controller
      control={form.control}
      name="firstName"
      rules={{
        required: "First name is required",
      }}
      render={({ field, formState }) => {
        return (
          <>
            <TextFieldInput
              variant="plain"
              placeholder="First name"
              value={field.value}
              className="px-2"
              onChange={(ev) => field.onChange(ev.target.value)}
            />
            {formState.errors.firstName?.message ? (
              <span className="mb-1 text-red-600 text-xs">
                {formState.errors.firstName.message}
              </span>
            ) : null}
          </>
        )
      }}
    />
  )
}

const useCandidateBuiltInFields = () => {
  return useMemo(
    () =>
      [
        {
          id: "firstName",
          name: "First name",
          type: "system",
          editable: true,
          dataType: "Text",
          field: {
            type: "Text",
            options: {},
          },
          // ValueComponent: () => {
          //   return (
          //     <Controller
          //       control={form.control}
          //       name="firstName"
          //       rules={{
          //         required: "First name is required",
          //       }}
          //       render={({ field, formState }) => {
          //         return (
          //           <>
          //             <TextFieldInput
          //               variant="plain"
          //               placeholder="First name"
          //               value={field.value}
          //               className="px-2"
          //               onChange={(ev) => field.onChange(ev.target.value)}
          //             />
          //             {formState.errors.firstName?.message ? (
          //               <span className="mb-1 text-red-600 text-xs">
          //                 {formState.errors.firstName.message}
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
          id: "lastName",
          name: "Last name",
          type: "system",
          editable: true,
          dataType: "Text",
          field: {
            type: "Text",
            options: {},
          },
          // ValueComponent: () => {
          //   return (
          //     <Controller
          //       control={form.control}
          //       name="lastName"
          //       rules={{
          //         required: "Last name is required",
          //       }}
          //       render={({ field, formState }) => {
          //         return (
          //           <>
          //             <TextFieldInput
          //               variant="plain"
          //               placeholder="Last name"
          //               value={field.value}
          //               className="px-2"
          //               onChange={(ev) => field.onChange(ev.target.value)}
          //             />
          //             {formState.errors.lastName?.message ? (
          //               <span className="mb-1 text-red-600 text-xs">
          //                 {formState.errors.lastName.message}
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
          id: "email",
          name: "Email",
          dataType: "Email",
          type: "system",
          editable: true,
          field: {
            type: "Email",
          },
          // ValueComponent: () => {
          //   return (
          //     <Controller
          //       control={form.control}
          //       name="email"
          //       rules={{
          //         required: "Email is required",
          //         validate: (val) => {
          //           const input = document.createElement("input")
          //           input.type = "email"
          //           input.value = val
          //           return input.checkValidity()
          //         },
          //       }}
          //       render={({ field, formState }) => {
          //         return (
          //           <>
          //             <TextFieldInput
          //               variant="plain"
          //               type="email"
          //               placeholder="Email address"
          //               value={field.value}
          //               className="px-2"
          //               onChange={(ev) => field.onChange(ev.target.value)}
          //             />
          //             {formState.errors.email?.message ? (
          //               <span className="mb-1 text-red-600 text-xs">
          //                 {formState.errors.email.message}
          //               </span>
          //             ) : null}
          //           </>
          //         )
          //       }}
          //     />
          //   )
          // },
        },
      ] as AttributeRenderDefinition[],
    [],
  )
}

export default useCandidateBuiltInFields
