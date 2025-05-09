import { useRef, useState } from "react"
import type { PopoverProps } from "react-aria-components"
import { Button } from "../button"
import DialogTrigger from "../dialog-trigger"
import CaretDown from "../icons/CaretDown"
import IntersectMinusBack from "../icons/IntersectMinusBack"
import ListBox from "../list-box"
import ListBoxItem from "../list-box-item"
import Popover from "../popover"
import { TextFieldInput } from "../text-field-input"
import { cn } from "../utils/cn"

export interface ComboBoxProps extends PopoverProps {
  options: {
    id: string
    name: string
    icon?: React.ReactElement
  }[]
  triggerButton: React.ComponentProps<typeof Button>
  label: string
  width?: string
  className?: string
  listBox?: React.ComponentProps<typeof ListBox>
}

const ComboBox = ({
  label,
  options,
  triggerButton: { className: triggerButtonClassname, ...triggerButton },
  width = "",
  listBox,
  ...popoverProps
}: ComboBoxProps) => {
  // cons t [opened, setOpened] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasFilters = options.length > 0
  const [filterSearchTerm, setFilterSearchTerm] = useState("")
  const fitleredFilters =
    filterSearchTerm.trim() !== ""
      ? options.filter(({ name }) =>
          name.toUpperCase().includes(filterSearchTerm.toUpperCase()),
        )
      : options

  return (
    <DialogTrigger>
      <Button
        ref={buttonRef}
        variant={"plain"}
        className={cn(
          "flex h-6 w-auto items-center gap-x-1 rounded-md px-1",
          triggerButtonClassname,
        )}
        {...triggerButton}
      />
      <Popover placement="bottom left" {...popoverProps}>
        {() => {
          return hasFilters ? (
            <>
              <TextFieldInput
                autoFocus
                value={filterSearchTerm}
                onChange={(ev) => {
                  setFilterSearchTerm(ev.target.value)
                }}
                placeholder="Filter..."
                className="h-11 rounded-none border-gray-100 border-x-0 border-t-0 border-b bg-transparent outline-none placeholder:text-gray-400"
              />
              <ListBox
                aria-label={label}
                style={{
                  minWidth: buttonRef.current?.getBoundingClientRect()?.width,
                }}
                {...listBox}
                className={cn(
                  `block max-h-96 w-full overflow-y-auto p-1 ${width}`,
                  listBox?.className,
                )}
              >
                {fitleredFilters.map(({ id, name, icon }) => {
                  return (
                    <ListBoxItem
                      key={id}
                      id={id}
                      textValue={name}
                      className="flex h-8 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                    >
                      <span className="text-slate-600">
                        {icon ?? <IntersectMinusBack />}
                      </span>
                      <span>{name}</span>
                    </ListBoxItem>
                  )
                })}
              </ListBox>
            </>
          ) : (
            <div className="flex h-20 w-56 items-center justify-center overflow-y-auto rounded-md p-1 text-gray-400">
              <span>No options available</span>
            </div>
          )
        }}
      </Popover>
    </DialogTrigger>
  )
}

export const getSelectLookProps = ({
  values,
  hideCaret = false,
}: { values: string[]; hideCaret?: boolean }) => ({
  className:
    "[--spacing-9:1.5rem] px-2 flex items-center rounded-md text-left border border-gray-300",
  children: (
    <>
      <span className="line-clamp-1 flex-1 overflow-hidden">
        {values.join(", ")}
      </span>
      {hideCaret ? null : <CaretDown />}
    </>
  ),
})

export default ComboBox
