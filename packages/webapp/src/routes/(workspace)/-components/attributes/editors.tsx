import { parseAbsolute } from "@internationalized/date"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { validUrlRegex } from "lib/src/utils/url"
import { useEffect, useRef, useState } from "react"
import type { DateValue } from "react-aria-components"
import {
  type CreateAttributeRequestConfigurationAnyOf,
  type CreateAttributeRequestConfigurationAnyOf3,
  CreateAttributeRequestConfigurationAnyOf3StyleEnum,
  type CreateAttributeRequestConfigurationAnyOf4,
  CreateAttributeRequestConfigurationAnyOf4TypeEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import X from "webui-library/src/icons/X"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { Switch } from "webui-library/src/switch"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { Calendar, DateField } from "webui-library/src/widgets/date-picker"
import Menu from "webui-library/src/widgets/menu"
import RTE from "webui-library/src/widgets/rte"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { globals } from "~/core/workspace/globals"
import type { CellEditingComponent, CellEditingComponentProps } from "./types"

const attributeEditors = {
  Text: (({
    value,
    close,
    options,
    activeElement,
    cellId,
    configuration: _configuration,
    editable = true,
  }: CellEditingComponentProps & { options?: { format?: "rte" } }) => {
    const isRte = options?.format === "rte"
    const [currentValue, setCurrentValue] = useState<
      string | { html: string; json: object } | undefined
    >(
      value
        ? (value as string | { html: string; json: object })
        : isRte
          ? { html: "", json: {} }
          : (value as undefined | string | { html: string; json: object }) ??
            "",
    )
    const triggerRef = useRef<HTMLElement>(activeElement ?? null)
    const rect = activeElement?.getBoundingClientRect()
    const configuration = _configuration as
      | CreateAttributeRequestConfigurationAnyOf
      | undefined
    const isMultiLine = configuration?.textType === "multi-line"

    return isRte || isMultiLine ? (
      <Popover
        isOpen
        offset={-(rect?.height ?? 0) - 1}
        placement="bottom left"
        className="w-96 rounded-md border-gray-200 border-opacity-75 px-2 py-1"
        onOpenChange={() => {
          if (currentValue !== value) close(currentValue)
          else close()
        }}
        triggerRef={triggerRef}
        animate={{
          opacity: [0, 1],
          scale: [0.9, 1],
          transformOrigin: "top left",
        }}
      >
        {isMultiLine ? (
          <textarea
            value={currentValue as string}
            onChange={(ev) => {
              setCurrentValue(ev.target.value)
            }}
            onBlur={() => {
              if (currentValue !== value) close(currentValue)
              else close()
            }}
            className="h-fit w-full self-center border-0 bg-transparent bg-white outline-none"
            rows={4}
          />
        ) : (
          <RTE
            defaultContent={
              typeof currentValue === "object"
                ? currentValue.html
                : currentValue ?? ""
            }
            autofocus
            editorProps={{
              attributes: {
                class: "max-h-72 overflow-y-auto",
              },
            }}
            onChange={(data) => {
              setCurrentValue(data)
            }}
          />
        )}
      </Popover>
    ) : (
      <TextFieldInput
        autoFocus
        onChange={(ev) => {
          setCurrentValue(ev.target.value)
        }}
        value={currentValue as string}
        onBlur={() => {
          if (currentValue !== value) close(currentValue)
          else close()
        }}
        className="self-center border-0 bg-transparent bg-white outline-none"
      />
    )
  }) satisfies CellEditingComponent,
  Email: (({ value, close }) => {
    const [currentValue, setCurrentValue] = useState(value ?? "")
    return (
      <TextFieldInput
        type="email"
        autoFocus
        onChange={(ev) => {
          setCurrentValue(ev.target.value)
        }}
        value={currentValue as string}
        onBlur={() => {
          if (currentValue !== value) close(currentValue)
          else close()
        }}
        className="self-center border-0 bg-transparent bg-white outline-none"
      />
    )
  }) satisfies CellEditingComponent,
  Number: (({ value, close }) => {
    const [currentValue, setCurrentValue] = useState(value ?? "")
    return (
      <TextFieldInput
        type="number"
        autoFocus
        onChange={(ev) => {
          setCurrentValue(ev.target.value)
        }}
        value={currentValue as string}
        onBlur={() => {
          if (currentValue !== value) close(currentValue)
          else close()
        }}
        className="self-center border-0 bg-transparent bg-white outline-none"
      />
    )
  }) satisfies CellEditingComponent,
  Date: (({ value, close, width }) => {
    const initialValue = value ?? new Date().toISOString()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const date = parseAbsolute(initialValue, timeZone)
    const onChange = (date: DateValue) => {
      const newValue = date.toDate(timeZone).toISOString()
      close(newValue)
    }

    return (
      <DialogTrigger>
        <Button
          variant={"plain"}
          className="block h-full w-full bg-transparent hover:bg-transparent"
        />
        <Popover
          isOpen
          onOpenChange={() => {
            close()
          }}
          className={`border-gray-200 border-opacity-75 ${width}`}
        >
          <DateField
            value={date}
            onChange={onChange}
            className="mb-3 h-10 border-gray-100 border-b border-solid px-2 leading-10"
          />
          <Calendar value={date} onChange={onChange} />
        </Popover>
      </DialogTrigger>
    )
  }) satisfies CellEditingComponent,
  Toggle: (({ value: _value, close, configuration: _configuration, width }) => {
    const value = _value as "Yes" | "No" | undefined
    const configuration = _configuration as
      | CreateAttributeRequestConfigurationAnyOf3
      | undefined
    const [currentValue, setCurrentValue] = useState(value)
    const [isOpen, setIsOpen] = useState(true)
    const style =
      configuration?.style ??
      CreateAttributeRequestConfigurationAnyOf3StyleEnum.YesNo
    const options = [{ name: "Yes" }, { name: "No" }] as const

    return style ===
      CreateAttributeRequestConfigurationAnyOf3StyleEnum.YesNo ? (
      <DialogTrigger>
        <Button
          variant={"plain"}
          className="block h-full w-full bg-transparent hover:bg-transparent"
        />
        <Popover
          placement="bottom left"
          isOpen={isOpen}
          onOpenChange={(isOpen) => {
            setIsOpen(isOpen)
            if (currentValue !== value) close(currentValue)
            else close()
          }}
          className={`border-gray-200 border-opacity-75 ${width}`}
        >
          <Dialog className="text-left outline-none">
            <ListBox
              onAction={(id) => {
                setCurrentValue(id as "Yes" | "No")
                close(id)
              }}
              aria-label="Toggle options"
              selectionMode="single"
              className="divide-y divide-solid divide-gray-100"
              autoFocus
            >
              {options.map(({ name }) => {
                return (
                  <ListBoxItem
                    key={name}
                    aria-label={name}
                    id={name}
                    className={`${name === currentValue ? "bg-blue-100 text-black" : ""} flex h-8 border border-white px-3 leading-8 outline-none focus:rounded-lg focus:border-gray-300`}
                  >
                    {name}
                  </ListBoxItem>
                )
              })}
            </ListBox>
          </Dialog>
        </Popover>
      </DialogTrigger>
    ) : (
      <Switch
        isSelected={currentValue === "Yes"}
        onChange={(val) => {
          setCurrentValue(val ? "Yes" : "No")
        }}
      />
    )
  }) satisfies CellEditingComponent,
  URL: (({ value, close }) => {
    const [currentValue, setCurrentValue] = useState<string>(
      (value as string) ?? "",
    )
    return (
      <TextFieldInput
        type="url"
        autoFocus
        onChange={(ev) => {
          setCurrentValue(ev.target.value)
        }}
        value={currentValue as string}
        onBlur={() => {
          const isValidUrl = validUrlRegex.test(currentValue)

          if (isValidUrl) {
            if (currentValue !== value) close(currentValue)
            else close()
          } else {
            close()
          }
        }}
        className="self-center border-0 bg-transparent bg-white outline-none"
      />
    )
  }) satisfies CellEditingComponent,
  Select: (({
    value: _value,
    close,
    configuration: _configuration,
    width,
    activeElement,
    cellId,
    attributeId,
    entity,
    type,
    field,
  }) => {
    const api = useWorkspaceApi()
    const value = _value as string | string[] | undefined

    const [currentValue, setCurrentValue] = useState(value)
    const [isOpen, setIsOpen] = useState(true)
    const triggerRef = useRef<HTMLElement>(activeElement ?? null)

    const [filterTerm, setFilterTerm] = useState("")
    const inputEl = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (inputEl.current) {
        inputEl.current.focus()
      }
    }, [])

    if (!field || field?.type !== "Select") return null

    const configuration =
      _configuration as CreateAttributeRequestConfigurationAnyOf4
    const rect = activeElement?.getBoundingClientRect()
    const isMultiSelect = !!field.options.isMultiSelect
    const isCustom = type === "custom"
    const options = field.options.items ?? []
    const isNullable = field.options.nullable ?? true

    return (
      <div>
        <Popover
          layoutId={cellId}
          layout
          transition={{
            // duration: 0.05,
            type: "spring",
            damping: 13.5,
            mass: 0.6,
            stiffness: 200,
          }}
          triggerRef={triggerRef}
          exit={{ transition: { duration: 0.5 } }}
          placement="bottom left"
          offset={-(rect?.height ?? 0)}
          isOpen={isOpen}
          onOpenChange={(isOpen) => {
            setIsOpen(isOpen)
            close(undefined)
            // if (!isOpen) {
            //   if (currentValue !== value) close(currentValue)
            //   else close()
            // }
          }}
          className={`w-72 overflow-hidden border-gray-200 border-opacity-75 ${width ?? ""}`}
          style={{}}
        >
          <motion.div
            layout="preserve-aspect"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex min-h-10 flex-wrap gap-x-2 gap-y-1 border-gray-200 border-b px-2 py-2.5"
          >
            {Array.isArray(value) ? (
              value.map((v) => (
                <RenderSelectedOption
                  key={v}
                  value={options.find((option) => option.id === v)?.name ?? ""}
                  {...(isNullable
                    ? {
                        close: () =>
                          close(
                            value.filter((v2) => v2 !== v),
                            true,
                          ),
                      }
                    : {})}
                />
              ))
            ) : value ? (
              <RenderSelectedOption
                value={
                  options.find((option) => option.id === value)?.name ?? ""
                }
                {...(isNullable
                  ? {
                      close: () => close(null),
                    }
                  : {})}
              />
            ) : null}
            <TextFieldInput
              layout="preserve-aspect"
              variant="plain"
              className="h-5 w-fit min-w-8 px-1 leading-5"
              placeholder="Search for an option"
              autoFocus
              ref={inputEl}
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
          </motion.div>
          <motion.div
            layout="preserve-aspect"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {filterTerm.trim() &&
            options.every((option) => option.name !== filterTerm.trim()) &&
            isCustom ? (
              <motion.div layout="preserve-aspect" className="mt-1 px-3 py-1">
                <Button
                  layout="preserve-aspect"
                  variant="plain"
                  className="inline-flex w-full items-center rounded-md bg-gray-100 px-2 text-left text-purpleX11"
                  onPress={async () => {
                    if (attributeId) {
                      await api.attribute.updateAttribute({
                        id: attributeId,
                        updateAttributeRequest: {
                          _configuration: {
                            ...configuration,
                            type: CreateAttributeRequestConfigurationAnyOf4TypeEnum.Select,
                            options: [
                              ...options.map((o) => o.name),
                              filterTerm,
                            ],
                          },
                        },
                      })
                      close(filterTerm)
                      queryClient.invalidateQueries({
                        queryKey: [api.attribute.getAttributes.name, entity],
                      })
                    }
                  }}
                >
                  <span>Create </span>{" "}
                  <span className="h-6 rounded-md bg-slate-100 px-1 leading-6">
                    {filterTerm}
                  </span>
                </Button>
              </motion.div>
            ) : null}
            <ListBox
              layout
              onAction={(id) => {
                const idValue = id as string
                if (isMultiSelect) {
                  let newValue = []
                  if (Array.isArray(currentValue)) {
                    if (currentValue.includes(idValue)) {
                      newValue = currentValue.filter((v) => v !== idValue)
                    } else {
                      newValue = [...currentValue, idValue]
                    }
                  } else {
                    newValue = currentValue
                      ? [currentValue, idValue]
                      : [idValue]
                  }
                  setCurrentValue(newValue)
                  close(newValue, true)
                } else {
                  setCurrentValue(idValue)
                  close(idValue)
                }
              }}
              aria-label="Toggle options"
              selectionMode="single"
              className="max-h-[28rem] divide-y divide-solid divide-gray-100 overflow-y-auto"
            >
              {options
                .filter((option) =>
                  option.name.toLowerCase().includes(filterTerm.toLowerCase()),
                )
                .map((option) => {
                  return (
                    <ListBoxItem
                      layout
                      key={option.id}
                      aria-label={option.name}
                      id={option.id}
                      className={
                        " group flex h-8 border border-transparent px-3 leading-8 outline-none focus:border-gray-200 focus:bg-gray-50"
                      }
                    >
                      <span className="flex-1">{option.name}</span>
                      {isCustom ? (
                        <Menu
                          triggerButton={{
                            className:
                              "text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-100",
                            children: <ThreeDotsHorizontal />,
                          }}
                          items={[
                            {
                              id: "delete",
                              children: "Delete",
                              onAction: async () => {
                                if (attributeId) {
                                  await api.attribute.deleteSelectOption({
                                    id: attributeId,
                                    deleteSelectOptionRequest: {
                                      option: option.name,
                                    },
                                  })
                                  await Promise.all([
                                    queryClient.invalidateQueries({
                                      queryKey: [
                                        api.attribute.getAttributes.name,
                                        entity,
                                      ],
                                    }),
                                    queryClient.invalidateQueries({
                                      queryKey: [
                                        entity === "Role"
                                          ? api.role.getRoles.name
                                          : api.opening.getOpenings.name,
                                        globals.filters[entity],
                                        globals.sorts,
                                      ],
                                    }),
                                  ])
                                }
                              },
                            },
                          ]}
                          popover={{
                            offset: 4,
                            placement: "right top",
                          }}
                        />
                      ) : null}
                    </ListBoxItem>
                  )
                })}
            </ListBox>
          </motion.div>
        </Popover>
      </div>
    )
  }) satisfies CellEditingComponent,
  Member: (({ value: _value, cellId, close, activeElement }) => {
    const value = _value as string | string[] | undefined
    const api = useWorkspaceApi()
    const [isOpen, setIsOpen] = useState(true)
    const [filterTerm, setFilterTerm] = useState("")
    const { data: profiles = [] } = useQuery({
      queryKey: [api.profile.getProfiles.name],
      queryFn: () => api.profile.getProfiles(),
    })
    const triggerRef = useRef<HTMLElement>(activeElement ?? null)
    const rect = activeElement?.getBoundingClientRect()
    const inputEl = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if (inputEl.current) {
        inputEl.current.focus()
      }
    }, [])

    return (
      <Popover
        layout
        layoutId={cellId}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen)
          close(undefined)
          // if (!isOpen) {
          //   if (currentValue !== value) close(currentValue)
          //   else close()
          // }
        }}
        isOpen={isOpen}
        triggerRef={triggerRef}
        placement="bottom left"
        offset={-(rect?.height ?? 0)}
        className="w-72 overflow-hidden border-gray-200 border-opacity-75"
      >
        <motion.div
          layout="preserve-aspect"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex min-h-10 flex-wrap gap-x-2 gap-y-1 border-gray-200 border-b px-2 py-2.5"
        >
          {Array.isArray(value) ? (
            value.map((v) => (
              <RenderSelectedOption
                key={v}
                value={v}
                close={() =>
                  close(
                    value.filter((v2) => v2 !== v),
                    true,
                  )
                }
              />
            ))
          ) : value ? (
            <RenderSelectedOption
              value={profiles.find((p) => p.id === value)?.firstName || ""}
              close={(value) => {
                close(null)
              }}
            />
          ) : null}
          <TextFieldInput
            ref={inputEl}
            layout="preserve-aspect"
            variant="plain"
            className="h-5 w-fit min-w-8 px-1 leading-5"
            placeholder="Search for an option"
            autoFocus
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          />
        </motion.div>
        <ListBox
          aria-label="Toggle options"
          selectionMode="single"
          layout="preserve-aspect"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-h-[28rem] divide-y divide-solid divide-gray-100 overflow-y-auto"
          onAction={(id) => {
            close(id)
          }}
        >
          {profiles
            ?.filter((profile) =>
              `${profile.firstName} ${profile.lastName} ${profile.displayName}`
                .toLowerCase()
                .includes(filterTerm.toLowerCase()),
            )
            .map((profile) => (
              <ListBoxItem
                id={profile.id}
                key={profile.id}
                textValue={`${profile.firstName} ${profile.lastName}`}
                className="flex h-8 border border-transparent px-3 leading-8 outline-none focus:border-gray-200 focus:bg-gray-50"
              >
                {profile.displayName?.trim()
                  ? profile.displayName
                  : `${profile.firstName} ${profile.lastName ?? ""}`}
              </ListBoxItem>
            ))}
        </ListBox>
      </Popover>
    )
  }) satisfies CellEditingComponent,
  File: () => <></>,
  Phone: () => <></>,
  Record: () => <></>,
  Range: () => <></>,
  Location: () => <></>,
}

function RenderSelectedOption({
  value,
  close,
}: { value: string; close?: (value?: string | null) => void }) {
  return (
    <div
      className={`inline-flex h-5 items-center gap-x-1 rounded-md bg-gray-100 text-[13px] leading-5 ${close ? "pl-1" : "px-1"}`}
    >
      <span className="text-gray-500">{value} </span>
      {close ? (
        <Button
          variant="plain"
          className="inline-flex h-5 w-5 items-center justify-center"
          onPress={() => close(value)}
        >
          <X width={12} />
        </Button>
      ) : (
        " "
      )}
    </div>
  )
}

export default attributeEditors
