import type { FormField } from "isomorphic-blocs/src/types/form"
import { type ComponentProps, type FunctionComponent, useRef } from "react"
import { useDrag, useDrop } from "react-aria"
import {
  Controller,
  type FormState,
  type UseFormReset,
  type UseFormReturn,
  useForm,
} from "react-hook-form"
import { Button } from "webui-library/src/button"
import { FieldError } from "webui-library/src/field-error"
import { Form } from "webui-library/src/form"
import Add from "webui-library/src/icons/Add"
import Link from "webui-library/src/icons/Link"
import Trash from "webui-library/src/icons/Trash"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { cn } from "webui-library/src/utils/cn"
import OpeningsSelector from "../../openings-selector"
import AddField from "./add-field"
import FieldAction from "./field-action"
import {
  type FormFieldValues,
  type INewFormContextValue,
  NewFormContext,
  fieldTypeIconMap,
} from "./utils"

interface Props extends ComponentProps<typeof Form> {
  className?: string
  Footer?: FunctionComponent<{
    formState: FormState<FormFieldValues>
    reset: UseFormReset<FormFieldValues>
  }>
  submitHandler(
    values: FormFieldValues,
    form: UseFormReturn<FormFieldValues>,
  ): Promise<void>
  defaultValues?: Partial<FormFieldValues>
  fieldContainerProps?: React.HTMLAttributes<HTMLDivElement>
  showOpenings?: boolean
  allowLinking?: boolean
}

const FieldSettings = ({
  item,
  fields,
  setFields,
  updateField,
  allowLinking = true,
}: {
  item: FormField
  fields: FormField[]
  setFields: (fields: FormField[]) => void
  updateField: (fieldId: string, field: Partial<FormField>) => void
  allowLinking?: boolean
}) => {
  const field = item as FormField
  const ref = useRef<HTMLDivElement>(null)
  const { id, name, type, attributeLinked } = field
  const Icon = fieldTypeIconMap[type] ?? (() => null)
  const { dragProps } = useDrag({
    getItems: () => {
      return [{ "text/plain": String(id) }]
    },
  })
  const { isDropTarget, dropProps } = useDrop({
    ref,
    async onDrop(e) {
      if (!ref.current) return

      const { height } = ref.current.getBoundingClientRect()

      const [item] = e.items
      if (item?.kind === "text") {
        const key = await item.getText("text/plain")
        const columnIndex = fields.findIndex((c) => c.id === key)
        const dropIndex =
          fields.findIndex((c) => c.id === id) + Math.round(e.y / height)
        if (dropIndex === -1) return
        if (columnIndex === -1) return
        const min = Math.min(dropIndex, columnIndex)
        const max = Math.max(dropIndex, columnIndex)

        if (min === max) return

        const newFields = [...fields]
        const droppedColumn = fields[columnIndex]
        if (droppedColumn) {
          if (dropIndex < columnIndex) {
            newFields.splice(
              min,
              max - min + 1,
              ...(dropIndex < columnIndex ? [droppedColumn] : []),
              ...fields.slice(min, max),
            )
          } else {
            newFields.splice(
              min,
              max - min + 1,
              ...fields.slice(min + 1, max + 1),
              ...(dropIndex > columnIndex ? [droppedColumn] : []),
            )
          }

          setFields?.(newFields)
        }
      }
    },
    onDropMove: (ev) => {
      if (!ref.current) return

      const { height } = ref.current.getBoundingClientRect()
      ref.current?.style.setProperty(
        "--drop-y",
        Math.round(ev.y / height).toString(),
      )
    },
    onDropEnter: () => {},
    onDropExit: () => {},
  })

  return (
    <div
      ref={ref}
      key={id}
      {...dragProps}
      {...dropProps}
      className={`after:-translate-y-1/2 relative w-full shrink-0 overflow-hidden bg-white [--drop-y:0] after:absolute after:top-[calc(var(--drop-y)*100%)] after:right-0 after:left-0 after:h-2 after:transform after:bg-gray-500 after:opacity-0 after:transition-all after:duration-100 after:content-[''] ${isDropTarget ? "after:opacity-100" : ""}`}
    >
      <div className="flex rounded-md border border-gray-200 bg-white p-2 px-2 shadow-sm">
        <FieldAction fieldId={id} allowLinking={allowLinking} />
        <div className="flex-1">
          <div className="flex items-center">
            <TextFieldInput
              value={name}
              placeholder="Question name"
              className="h-6 w-full border-none leading-6 outline-none"
              onChange={(ev) => {
                updateField(id, { name: ev.target.value })
              }}
            />
            {attributeLinked ? (
              <span className="mx-1 text-gray-400 text-xs">
                <Link />
              </span>
            ) : null}
            <span className="text-gray-400 text-xs">
              <Icon />
            </span>
          </div>
          {attributeLinked ? null : (
            <>
              {field.type === "select" ? (
                <div className="px-2">
                  <div>
                    {field.options.map((option, index) => {
                      return (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={index}
                          className="group flex items-center gap-x-2"
                        >
                          <span
                            className={`h-3 w-3 border border-gray-300 ${field.maxSelection === "unlimited" ? "rounded-sm" : "rounded-full"}`}
                          />
                          <TextFieldInput
                            variant={"plain"}
                            value={option}
                            placeholder="Option"
                            onChange={(ev) => {
                              updateField(id, {
                                options: field.options.map((option, i) =>
                                  index === i ? ev.target.value : option,
                                ),
                              })
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="plain"
                            className="hidden text-gray-600 group-hover:inline-block"
                            onPress={() => {
                              updateField(id, {
                                options: field.options.filter(
                                  (_, i) => i !== index,
                                ),
                              })
                            }}
                          >
                            <Trash className="w-3.5" />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      variant="plain"
                      className="mt-1 flex items-center text-gray-500"
                      onPress={() => {
                        updateField(id, {
                          options: [
                            ...field.options,
                            `Option ${field.options.length + 1}`,
                          ],
                        })
                      }}
                    >
                      <span className="mr-2 w-3">
                        <Add />
                      </span>
                      <span>Add option</span>
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const FormEdit = ({
  className,
  Footer,
  submitHandler,
  defaultValues = {},
  fieldContainerProps,
  showOpenings = true,
  allowLinking = true,
  ...formProps
}: Props) => {
  const form = useForm<FormFieldValues>({
    defaultValues: {
      fields: [
        {
          name: "Question 1",
          id: crypto.randomUUID(),
          type: "text",
          required: true,
        },
        {
          name: "Question 2",
          id: crypto.randomUUID(),
          type: "text",
          required: true,
        },
      ],
      openings: [],
      ...defaultValues,
    },
  })
  const { formState, handleSubmit, control, reset } = form
  const onSubmit = handleSubmit(async (values) => {
    await submitHandler(values, form)
  })

  return (
    <Form
      {...formProps}
      onSubmit={onSubmit}
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
    >
      <div
        className={cn(
          "flex flex-1 flex-col gap-y-3 overflow-y-auto",
          fieldContainerProps?.className,
        )}
      >
        <Controller
          name="title"
          control={control}
          rules={{
            required: "A title is required",
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => {
            return (
              <TextFieldManager
                isInvalid={invalid || !!errors.root?.message}
                aria-label="Email address"
                className="mt-4 px-4"
                isRequired
                validationBehavior="aria"
              >
                <TextFieldInput
                  autoFocus
                  placeholder="Title"
                  className="border-none text-2xl outline-none"
                  onChange={field.onChange}
                  disabled={formState.isSubmitting}
                  value={field.value}
                />
                <FieldError className="mx-2">
                  {error?.message || errors.root?.message}
                </FieldError>
              </TextFieldManager>
            )
          }}
        />
        {showOpenings ? (
          <div className="mx-5 border-gray-100 border-b pb-3">
            <Controller
              control={control}
              name="openings"
              render={({ field }) => {
                const selectedOpenings = field.value
                return (
                  <OpeningsSelector
                    onChange={(id, selected) => {
                      field.onChange(
                        selected
                          ? [...selectedOpenings, id]
                          : selectedOpenings.filter((_id) => _id !== id),
                      )
                    }}
                    selection={selectedOpenings}
                    placement="bottom left"
                  />
                )
              }}
            />
          </div>
        ) : null}
        <div className="mx-5 py-3">
          <Controller
            control={control}
            name="fields"
            render={({ field }) => {
              const fields = field.value
              const onChange = field.onChange as (args: FormField[]) => void
              const setFields: React.Dispatch<
                React.SetStateAction<FormField[]>
              > = (args) => {
                if (typeof args === "function") {
                  onChange(args(fields))
                } else {
                  onChange(args)
                }
              }
              const updateField: INewFormContextValue["updateField"] = (
                fieldId,
                update,
              ) => {
                setFields((fields) =>
                  fields.map((field) =>
                    field.id === fieldId
                      ? { ...field, ...(update as FormField) }
                      : field,
                  ),
                )
              }
              const removeField: INewFormContextValue["removeField"] = (
                fieldId,
              ) => {
                setFields(fields.filter(({ id }) => id !== fieldId))
              }

              return (
                <NewFormContext.Provider
                  value={{
                    fields,
                    addField: (field) => {
                      setFields([...fields, field])
                    },
                    removeField,
                    updateField,
                  }}
                >
                  <>
                    <div className="flex flex-1 flex-col gap-y-3">
                      {fields.map((item) => {
                        return (
                          <FieldSettings
                            key={item.id}
                            item={item}
                            fields={fields}
                            setFields={setFields}
                            updateField={updateField}
                            allowLinking={allowLinking}
                          />
                        )
                      })}
                    </div>
                    <div className="mx-5 mt-4 flex flex-1 flex-col gap-y-3 border-gray-100 border-t py-6">
                      {/* {fields.map((field) => {
              const { id, name, type } = field
              const Icon = fieldTypeIconMap[type]
              return (
                <div
                  key={id}
                  className="flex rounded-md border border-gray-200 bg-white p-2 px-2 shadow-sm"
                >
                  <FieldAction fieldId={id} />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <TextFieldInput
                        value={name}
                        placeholder="Question name"
                        className="h-6 w-full border-none leading-6 outline-none"
                        onChange={(ev) => {
                          updateField(id, { name: ev.target.value })
                        }}
                      />
                      <span className="text-gray-400">
                        <Icon />
                      </span>
                    </div>
                    {field.type === "select" ? (
                      <div className="px-2">
                        <div>
                          {field.options.map((option, index) => {
                            return (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                className="group flex items-center gap-x-2"
                              >
                                <span
                                  className={`h-3 w-3 border border-gray-300 ${field.maxSelection === "unlimited" ? "rounded-sm" : "rounded-full"}`}
                                />
                                <TextFieldInput
                                  variant={"plain"}
                                  value={option}
                                  placeholder="Option"
                                  onChange={(ev) => {
                                    updateField(id, {
                                      options: field.options.map((option, i) =>
                                        index === i ? ev.target.value : option,
                                      ),
                                    })
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  variant="plain"
                                  className="hidden text-gray-600 group-hover:inline-block"
                                  onPress={() => {
                                    updateField(id, {
                                      options: field.options.filter(
                                        (_, i) => i !== index,
                                      ),
                                    })
                                  }}
                                >
                                  <Trash className="w-3.5" />
                                </Button>
                              </div>
                            )
                          })}
                          <Button
                            variant="plain"
                            className="mt-1 flex items-center text-gray-500"
                            onPress={() => {
                              updateField(id, {
                                options: [
                                  ...field.options,
                                  `Option ${field.options.length + 1}`,
                                ],
                              })
                            }}
                          >
                            <span className="mr-2 w-3">
                              <Add />
                            </span>
                            <span>Add option</span>
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })} */}
                      <div className="flex justify-center p-3">
                        <AddField />
                      </div>
                    </div>
                  </>
                </NewFormContext.Provider>
              )
            }}
          />
        </div>
      </div>
      {Footer ? <Footer formState={formState} reset={reset} /> : null}
    </Form>
  )
}

export default FormEdit

/**
 * fields: Field[]
 * field: {type: string; connect: custom; title: string; required: boolean; description: string; }
 */
