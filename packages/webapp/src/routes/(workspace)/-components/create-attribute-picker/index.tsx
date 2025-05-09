import type { AttributeDataType, EntityType } from "isomorphic-blocs/src/prisma"
import { dateFormats, timeFormats } from "lib/src/data/date"
import numberFormats from "lib/src/data/number-formats"
import { textTypes } from "lib/src/data/text"
import { toggleStyles } from "lib/src/data/toggle"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import { Form } from "webui-library/src/form"
import Add from "webui-library/src/icons/Add"
import Calendar from "webui-library/src/icons/Calendar"
import CaretRight from "webui-library/src/icons/CaretRight"
import Link from "webui-library/src/icons/Link"
import NumberSign from "webui-library/src/icons/NumberSign"
import User from "webui-library/src/icons/User"
import At from "webui-library/src/icons/at"
import CaretDownCircle from "webui-library/src/icons/caret-down-circle"
import TextAlignJustifyCenter from "webui-library/src/icons/text-align-justify-center"
import Toggle from "webui-library/src/icons/toggle"
import { Label } from "webui-library/src/label"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { Switch } from "webui-library/src/switch"
import { TextFieldInput } from "webui-library/src/text-field-input"
import type { Icon } from "webui-library/src/types"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import SelectOptions from "./select-options"

interface AttributeItem {
  id: AttributeDataType
  name: string
  Icon: Icon
}

interface Props {
  style?: "icon" | "button"
  entityType: EntityType
}

type TextType = (typeof textTypes)[number]["id"]
type NumberFormat = (typeof numberFormats)[number]
type ToggleStyleFormat = (typeof toggleStyles)[number]
type DateFormat = (typeof dateFormats)[number]
type TimeFormat = (typeof timeFormats)[number]
type TSelectedField =
  | {
      type: "Email" | "File" | "Location" | "Range" | "Phone"
      name: string
    }
  | { type: "Text"; name: string; textType: TextType }
  | { type: "Number"; name: string; format: NumberFormat }
  | { type: "Toggle"; name: string; style: ToggleStyleFormat }
  | {
      type: "Date"
      name: string
      dateFormat: DateFormat
      timeFormat: TimeFormat
    }
  | {
      type: "Select"
      name: string
      isMultiSelect: boolean
      options: string[]
    }
  | { type: "URL"; name: string; showFullUrl: boolean }
  | null

const CreateAttributePicker = ({ style = "icon", entityType }: Props) => {
  const api = useWorkspaceApi()
  const [opened, setOpened] = useState(false)
  const form = useForm<{
    selectedField: TSelectedField
  }>({
    defaultValues: {
      selectedField: null,
    },
  })
  // const [selectedField, setSelectedField] = useState<
  // >(null)
  const attributes: AttributeItem[] = [
    {
      id: "Text",
      name: "Text",
      Icon: TextAlignJustifyCenter,
    },
    {
      id: "Number",
      name: "Number",
      Icon: NumberSign,
    },
    {
      id: "Toggle",
      name: "Toggle",
      Icon: Toggle,
    },
    {
      id: "Date",
      name: "Date",
      Icon: Calendar,
    },
    {
      id: "Select",
      name: "Select",
      Icon: CaretDownCircle,
    },
    {
      id: "Email",
      name: "Email",
      Icon: At,
    },
    {
      id: "URL",
      name: "URL",
      Icon: Link,
    },
    {
      id: "Member",
      name: "Member",
      Icon: User,
    },
  ]
  const onSubmit = form.handleSubmit(async ({ selectedField }) => {
    if (!selectedField) return

    const { name, type, ...configuration } = selectedField
    const data = {
      entity: entityType,
      name,
      _configuration: {
        type,
        ...configuration,
      },
    }
    await api.attribute.createAttribute({
      createAttributeRequest: data,
    })
    await queryClient.invalidateQueries({
      queryKey: [api.attribute.getAttributes.name, entityType],
    })
    form.setValue("selectedField", null)
    setOpened(false)
  })

  return (
    <Controller
      control={form.control}
      name="selectedField"
      render={({ field }) => {
        const selectedField = field.value
        const setSelectedField = (
          value: TSelectedField | ((value: TSelectedField) => TSelectedField),
        ) => {
          if (typeof value === "function") field.onChange(value(selectedField))
          else field.onChange(value)
        }

        return (
          <DialogTrigger
            isOpen={opened}
            onOpenChange={(isOpen) => {
              setOpened(isOpen)
              if (!isOpen) setSelectedField(null)
            }}
          >
            {style === "button" ? (
              <Button
                variant={"plain"}
                className="flex h-6 items-center px-1 text-gray-400 leading-6"
              >
                <Add strokeWidth={0.8} />
                <span>Add a property</span>
              </Button>
            ) : (
              <Button
                variant={"plain"}
                className={
                  "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-none px-2 text-left text-slate-500 leading-9 outline-none focus:after:absolute focus:after:inset-0 focus:after:block focus:after:rounded-sm focus:after:border-[0.5px] focus:after:border-slate-400 focus:after:border-solid focus-visible:ring-0"
                }
              >
                <Add />
              </Button>
            )}
            <Popover
              placement={style === "button" ? "bottom left" : "right top"}
              className="w-56 border-gray-200 border-opacity-75"
            >
              <Dialog className="outline-none">
                <Form onSubmit={onSubmit} className=" overflow-y-auto p-1">
                  {selectedField ? (
                    <div className="h-54 bg-white px-1 pb-2">
                      <div className="mb-2 flex items-center gap-x-2 py-1">
                        <Button
                          onPress={() => setSelectedField(null)}
                          variant={"plain"}
                        >
                          <CaretRight className=" -rotate-180 transform" />
                        </Button>
                        <span className="">Attribute</span>
                      </div>
                      <div className="flex flex-col gap-y-2 px-1 text-gray-500">
                        <Label>
                          <div className="mb-0.5">Name</div>
                          <TextFieldInput
                            className="h-7 px-1 text-black leading-7 outline-gray-500"
                            value={selectedField.name}
                            onChange={(ev) =>
                              setSelectedField((field) =>
                                field
                                  ? {
                                      ...field,
                                      name: ev.target.value,
                                    }
                                  : field,
                              )
                            }
                          />
                        </Label>
                        {selectedField.type === "Text" ? (
                          <Label>
                            <div className="mb-0.5">Type</div>
                            <select
                              onChange={(ev) => {
                                setSelectedField({
                                  ...selectedField,
                                  textType: ev.target.value as TextType,
                                })
                              }}
                              className="h-7 w-full rounded-md border border-gray-300 text-black leading-7"
                            >
                              {textTypes.map(({ id, name }) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </Label>
                        ) : null}
                        {selectedField.type === "Number" ? (
                          <Label>
                            <div className="mb-0.5">Format</div>
                            <select
                              onChange={(ev) => {
                                setSelectedField({
                                  ...selectedField,
                                  format: ev.target.value as NumberFormat,
                                })
                              }}
                              className="h-7 w-full rounded-md border border-gray-300 text-black leading-7"
                            >
                              {numberFormats.map((format) => (
                                <option key={format} value={format}>
                                  {format}
                                </option>
                              ))}
                            </select>
                          </Label>
                        ) : null}
                        {selectedField.type === "Toggle" ? (
                          <Label>
                            <div className="mb-0.5">Style</div>
                            <select
                              onChange={(ev) => {
                                setSelectedField({
                                  ...selectedField,
                                  style: ev.target.value as ToggleStyleFormat,
                                })
                              }}
                              className="h-7 w-full rounded-md border border-gray-300 text-black leading-7"
                            >
                              {toggleStyles.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </Label>
                        ) : null}
                        {selectedField.type === "Date" ? (
                          <>
                            <Label>
                              <div className="mb-0.5">Date format</div>
                              <select
                                onChange={(ev) => {
                                  setSelectedField({
                                    ...selectedField,
                                    dateFormat: ev.target.value as DateFormat,
                                  })
                                }}
                                className="h-7 w-full rounded-md border border-gray-300 text-black leading-7"
                              >
                                {dateFormats.map((format) => (
                                  <option key={format} value={format}>
                                    {format}
                                  </option>
                                ))}
                              </select>
                            </Label>
                            <Label>
                              <div className="mb-0.5">Time format</div>
                              <select
                                onChange={(ev) => {
                                  setSelectedField({
                                    ...selectedField,
                                    timeFormat: ev.target.value as TimeFormat,
                                  })
                                }}
                                className="h-7 w-full rounded-md border border-gray-300 text-black leading-7"
                              >
                                {timeFormats.map((format) => (
                                  <option key={format} value={format}>
                                    {format}
                                  </option>
                                ))}
                              </select>
                            </Label>
                          </>
                        ) : null}
                        {selectedField.type === "Select" ? (
                          <>
                            <Label className="flex h-8 items-center justify-between">
                              <div>Multi-select</div>
                              <Switch
                                onChange={(isSelected) => {
                                  setSelectedField({
                                    ...selectedField,
                                    isMultiSelect: isSelected,
                                  })
                                }}
                              />
                            </Label>
                            <div>
                              <div className="mb-1">Options</div>
                              <SelectOptions
                                options={selectedField.options}
                                setOptions={(options) =>
                                  setSelectedField({
                                    ...selectedField,
                                    options,
                                  })
                                }
                              />
                            </div>
                          </>
                        ) : null}
                        {selectedField.type === "URL" ? (
                          <>
                            <Label className="flex h-8 items-center justify-between">
                              <div>Show full URL</div>
                              <Switch
                                onChange={(isSelected) => {
                                  setSelectedField({
                                    ...selectedField,
                                    showFullUrl: isSelected,
                                  })
                                }}
                              />
                            </Label>
                          </>
                        ) : null}
                      </div>
                      <Button
                        type="submit"
                        variant={"elevated"}
                        className="mx-1 mt-3 h-6 w-full leading-6"
                      >
                        Create
                      </Button>
                    </div>
                  ) : (
                    <ListBox
                      aria-label="List of entity types that can be created"
                      shouldFocusWrap
                      autoFocus
                      className="block outline-none"
                    >
                      {attributes.map(({ id, name, Icon }) => {
                        return (
                          <ListBoxItem
                            key={id}
                            className="flex h-7 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                            onAction={() => {
                              switch (id) {
                                case "Number":
                                  setSelectedField({
                                    type: id,
                                    name,
                                    format: "Number",
                                  })
                                  break
                                case "Toggle":
                                  setSelectedField({
                                    type: id,
                                    name,
                                    style: "Yes/No",
                                  })
                                  break
                                case "Date":
                                  setSelectedField({
                                    type: id,
                                    name,
                                    dateFormat: "Day/Month/Year",
                                    timeFormat: "Hidden",
                                  })
                                  break
                                case "Select":
                                  setSelectedField({
                                    type: id,
                                    name,
                                    options: ["Option 1", "Option 2"],
                                    isMultiSelect: false,
                                  })
                                  break
                                case "URL":
                                  setSelectedField({
                                    type: id,
                                    name,
                                    showFullUrl: false,
                                  })
                                  break
                                default:
                                  setSelectedField({ type: id, name })
                                  break
                              }

                              // setOpened(false)
                            }}
                            textValue={name}
                          >
                            <span className="text-slate-600">
                              <Icon width={12} height={12} />
                            </span>
                            <span>{name}</span>
                          </ListBoxItem>
                        )
                      })}
                    </ListBox>
                  )}
                </Form>
              </Dialog>
            </Popover>
          </DialogTrigger>
        )
      }}
    />
  )
}

export default CreateAttributePicker
