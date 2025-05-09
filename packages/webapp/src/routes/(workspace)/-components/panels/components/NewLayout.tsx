import type { EntityType } from "isomorphic-blocs/src/prisma"
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type FormState,
  type UseFormHandleSubmit,
  type UseFormReturn,
} from "react-hook-form"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import Clock from "webui-library/src/icons/Clock"
import Tags from "webui-library/src/icons/Tags"
import { TextFieldInput } from "webui-library/src/text-field-input"
import RTE from "webui-library/src/widgets/rte"
import EntityFieldsSection from "../../attributes/entity-fields-section"
import type { BuiltInFieldRenderDefinition } from "../../attributes/types"

interface NewLayoutProps<V extends FieldValues> {
  onSubmit: ReturnType<UseFormHandleSubmit<V>> // (values: V, setError: UseFormSetError<V>): Promise<void>
  title?: {} & Omit<ControllerProps<V>, "control" | "render">
  description?: {} & Omit<ControllerProps<V>, "control" | "render">
  entityType: EntityType
  fields?: BuiltInFieldRenderDefinition[]
  form: UseFormReturn
}

export const NewLayoutFooter = ({
  formState,
  children,
  button = { children: formState.isSubmitting ? "Creating" : "Create" },
}: React.PropsWithChildren<{
  formState: FormState<FieldValues>
  button?: React.ComponentProps<typeof Button>
}>) => {
  return (
    <div className="flex items-center border-gray-200 border-t border-solid bg-gray-50 px-4 py-3">
      <div className="flex-1" />
      {children}
      <Button
        type="submit"
        variant={"elevated"}
        className="px-2 [--spacing-9:1.5rem]"
        isDisabled={formState.isSubmitting}
        {...button}
      />
    </div>
  )
}

const NewLayout = <V extends FieldValues>({
  onSubmit,
  title,
  description,
  entityType,
  fields,
  form,
}: NewLayoutProps<V>) => {
  const { formState, control } = form

  return (
    <Form
      onSubmit={onSubmit}
      className="flex w-[35rem] flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
        {title ? (
          <Controller
            {...title}
            control={control}
            render={({ field }) => {
              return (
                <TextFieldInput
                  autoFocus
                  placeholder="Title"
                  className="mt-4 border-none px-6 text-2xl outline-none"
                  onChange={field.onChange}
                  disabled={formState.isSubmitting}
                />
              )
            }}
          />
        ) : null}
        <div className="hidden items-center px-6">
          <Clock className="mr-1 text-gray-500" />
          <span className="mr-2.5 w-24 text-gray-500">Created</span>
          <span className="flex-1">Now</span>
        </div>
        <div className="hidden items-center px-6">
          <Tags className="mr-1 text-gray-500" />
          <span className="mr-2.5 w-24 text-gray-500">Tags</span>
          <span className="flex-1"> </span>
        </div>
        <div className="py-1 pr-6 pl-5">
          {/* {fields ? <BuiltInFields fields={fields} form={form} /> : null} */}
          <EntityFieldsSection
            form={form}
            entityType={entityType}
            builtInAttributes={fields ?? []}
          />
        </div>
        {description ? (
          <>
            <div className="mx-6 border-gray-100 border-t border-solid" />
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <Controller
                {...description}
                control={control}
                rules={{
                  validate: (value) => {
                    return !!value?.html || "Description is required"
                    // const div = document.createElement("div")
                    // div.innerHTML = value?.html ?? ""
                    // if (!div.textContent?.trim())
                    //   return "Description is required"
                    // return true
                  },
                }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      {fieldState.error ? (
                        <span className="text-red-500">
                          {fieldState.error.message}
                        </span>
                      ) : null}
                      <RTE
                        onChange={({ html }) => {
                          field.onChange({ html, json: {} })
                        }}
                        editable={!formState.isSubmitting}
                      />
                    </>
                  )
                }}
              />
            </div>
          </>
        ) : null}
      </div>
      <NewLayoutFooter formState={formState} />
    </Form>
  )
}

export default NewLayout
