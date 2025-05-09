import { getLocalTimeZone, parseAbsolute } from "@internationalized/date"
import { type ComponentProps, useEffect, useRef, useState } from "react"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import ListBox from "webui-library/src/list-box"
import ListBoxItem from "webui-library/src/list-box-item"
import Popover from "webui-library/src/popover"
import { Switch } from "webui-library/src/switch"
import { TextFieldInput } from "webui-library/src/text-field-input"
import DatePicker from "webui-library/src/widgets/date-picker"
import Dropdown from "webui-library/src/widgets/dropdown"
import Menu from "webui-library/src/widgets/menu"
import { textDataTypes } from "~/core/workspace/attributes/data"
import {
  type Operator,
  operatorToLabelMap,
  typeToOperatorsMap,
} from "~/lib/conditions"
import type { Filter } from "./types"

interface Props {
  filter: Filter
  operator: Operator
  remove(): void
  value: unknown
  setValue(value: unknown): void
  close(): void
  setOperator(operator: Operator): void
  config: unknown
}

const TextField = ({
  value,
  setValue,
  close,
  setOperator,
  ...props
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
} & ComponentProps<typeof TextFieldInput>) => {
  const timerId = useRef<number>(null)

  return (
    <TextFieldInput
      {...props}
      autoFocus
      placeholder="Type here"
      defaultValue={(value as string) ?? ""}
      className="block h-6 px-1 text-xs leading-6 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
      onChange={(ev) => {
        if (timerId.current) clearTimeout(timerId.current)

        timerId.current = setTimeout(() => {
          setValue(ev.target.value)
        }, 500)
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault()
          close()
        }
      }}
    />
  )
}

// Reusable Popover for components
function MyPopover(props: ComponentProps<typeof Popover>) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) =>
        `overflow-auto rounded-lg bg-white ring-1 ring-black/10 drop-shadow-lg ${
          isEntering
            ? "fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 animate-in duration-200 ease-out"
            : ""
        }${
          isExiting
            ? "fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 animate-out duration-150 ease-in"
            : ""
        }`
      }
    />
  )
}

// Reuse RoundButton component
function RoundButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border-0 bg-transparent pressed:bg-gray-200 text-gray-600 outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring"
    />
  )
}

// DatePicker component for filter
const DateFilterPicker = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  const initialDate = value ?? new Date().toISOString()
  const timeZone = getLocalTimeZone()
  // const [currentValue, setCurrentValue] = useState<string>(
  //   (value as string) || initialDate.toISOString(),
  // )

  return (
    <div className="flex w-full items-center">
      <DatePicker
        {...(value
          ? {
              value: parseAbsolute(initialDate as string, timeZone),
            }
          : {})}
        // granularity="day"
        className="rounded-md border border-gray-300 pl-1"
        onChange={(date) => {
          const newValue = date.toDate(timeZone).toISOString()
          setValue(newValue)
        }}
      />
    </div>
  )
}

// Toggle filter component
const ToggleFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  const isChecked = value === "Yes"

  return (
    <div className="flex items-center">
      <Switch
        isSelected={isChecked}
        onChange={(checked) => {
          setValue(checked ? "Yes" : "No")
          close()
        }}
        className="mr-2"
      />
      <span className="text-xs">{isChecked ? "True" : "False"}</span>
    </div>
  )
}

// Select filter component
const SelectFilter = ({
  value,
  setValue,
  close,
  filter,
  options: config,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
  filter: Filter
  options: Extract<Filter, { type: "Select" }>["options"]
}) => {
  const options = config.items
  const [selectedValue, setSelectedValue] = useState<string>(
    (value as string) || "",
  )
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex w-full items-center">
      <DialogTrigger>
        <Button
          variant="plain"
          className="block w-full rounded border border-gray-200 px-2 py-1 text-left text-xs"
          onPress={() => setIsOpen(true)}
        >
          {options.find((option) => option.id === selectedValue)?.name ||
            "Select an option..."}
        </Button>
        <Popover
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          className="w-[15rem] border-gray-200 border-opacity-75"
        >
          <Dialog className="text-left outline-none">
            <ListBox
              onAction={(id) => {
                setSelectedValue(id as string)
                setValue(id)
                setIsOpen(false)
              }}
              aria-label="Options"
              selectionMode="single"
              className="max-h-[28rem] divide-y divide-solid divide-gray-100 overflow-y-auto"
              autoFocus
            >
              {options.map(({ name, id }) => (
                <ListBoxItem
                  key={id}
                  id={id}
                  className="flex h-8 px-3 leading-8 outline-none hover:bg-gray-50"
                >
                  {name}
                </ListBoxItem>
              ))}
            </ListBox>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  )
}

const LocationFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  return (
    <TextField
      type="text"
      value={value}
      setValue={setValue}
      close={close}
      placeholder="Enter location..."
    />
  )
}

const FileFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  return (
    <TextField
      type="text"
      value={value}
      setValue={setValue}
      close={close}
      placeholder="Enter filename..."
    />
  )
}

const MemberFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  return (
    <TextField
      type="text"
      value={value}
      setValue={setValue}
      close={close}
      placeholder="Enter member name..."
    />
  )
}

const RecordFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  return (
    <TextField
      type="text"
      value={value}
      setValue={setValue}
      close={close}
      placeholder="Enter record value..."
    />
  )
}

const RangeFilter = ({
  value,
  setValue,
  close,
}: {
  value: unknown
  setValue(value: unknown): void
  close(): void
}) => {
  const [minValue, setMinValue] = useState<string>(
    (value as { min: string })?.min || "",
  )
  const [maxValue, setMaxValue] = useState<string>(
    (value as { max: string })?.max || "",
  )

  useEffect(() => {
    setValue({
      min: minValue ? Number(minValue) : null,
      max: maxValue ? Number(maxValue) : null,
    })
  }, [minValue, maxValue, setValue])

  return (
    <div className="flex items-center gap-1">
      <TextFieldInput
        type="number"
        autoFocus
        placeholder="Min"
        defaultValue={minValue}
        className="block h-6 w-16 px-1 text-xs leading-6 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        onChange={(ev) => setMinValue(ev.target.value)}
      />
      <span className="text-xs">to</span>
      <TextFieldInput
        type="number"
        placeholder="Max"
        defaultValue={maxValue}
        className="block h-6 w-16 px-1 text-xs leading-6 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        onChange={(ev) => setMaxValue(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault()
            close()
          }
        }}
      />
    </div>
  )
}

const FilterEditor = ({
  filter,
  operator,
  remove,
  value,
  setValue,
  close,
  setOperator,
  config,
}: Props) => {
  const { nullable = true } = filter
  const operators = nullable
    ? typeToOperatorsMap[filter.type]
    : typeToOperatorsMap[filter.type].filter(
        (operator) => !["isNull", "isNotNull"].includes(operator),
      )

  // Skip filter editor UI for empty/not empty operators
  const skipValueEditor =
    operator === "isNull" ||
    operator === "isNotNull" ||
    operator === "isTrue" ||
    operator === "isFalse"
  // ||
  // ((operator === "eq" || operator === "notEq") &&
  //   filter.type === GetAttributes200ResponseInnerDataTypeEnum.Toggle)

  return (
    <div className="w-64 rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
      <div className="flex items-center text-xs">
        <span className="mr-[1px]">{filter.name}</span>
        <Dropdown
          selectedKey={operator}
          button={{
            className:
              "h-4 leading-4 overflow-hidden px-0.5 border-none outline-none focus:bg-gray-50",
          }}
          items={operators.map((operator) => {
            const label = operatorToLabelMap[operator]
            return {
              id: operator,
              children: label,
              // filter.type === GetAttributes200ResponseInnerDataTypeEnum.Toggle
              //   ? operator === "eq"
              //     ? "Is true"
              //     : operator === "notEq"
              //       ? "Is false"
              //       : label
              //   : label,
            }
          })}
          onSelectionChange={(key) => {
            const operator = key as Operator
            setOperator(operator)
          }}
        />
        <div className="flex flex-1 justify-end">
          <Menu
            triggerButton={{
              className: "inline-flex h-4 w-4 items-center justify-center",
              children: <ThreeDotsHorizontal width={14} />,
            }}
            items={[
              {
                id: "delete",
                children: "Delete filter",
                onAction: () => {
                  remove()
                },
              },
            ]}
            className="text-xs"
          />
        </div>
      </div>
      {!skipValueEditor && (
        <div className="pt-2.5 pb-1.5">
          {textDataTypes.includes(filter.type) && (
            <TextField
              type={filter.type}
              value={value}
              setValue={
                filter.type === "Number"
                  ? (val) => setValue(Number(val))
                  : setValue
              }
              close={close}
            />
          )}

          {filter.type === "Date" ? (
            <DateFilterPicker value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Toggle" ? (
            <ToggleFilter value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Select" ? (
            <SelectFilter
              value={value}
              setValue={setValue}
              close={close}
              filter={filter}
              options={
                filter.options
                // (config as CreateAttributeRequestConfigurationAnyOf4).options
              }
            />
          ) : null}

          {filter.type === "File" ? (
            <FileFilter value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Location" ? (
            <LocationFilter value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Member" ? (
            <MemberFilter value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Record" ? (
            <RecordFilter value={value} setValue={setValue} close={close} />
          ) : null}

          {filter.type === "Range" ? (
            <RangeFilter value={value} setValue={setValue} close={close} />
          ) : null}
        </div>
      )}
    </div>
  )
}

export default FilterEditor
