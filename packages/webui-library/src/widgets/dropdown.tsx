import {
  Label,
  type LabelProps,
  ListBox,
  ListBoxItem,
  type ListBoxProps,
  Select,
  type SelectProps,
  SelectValue,
} from "react-aria-components"
import { Button } from "../button"
import CaretDown from "../icons/CaretDown"
import Popover from "../popover"
import { cn } from "../utils/cn"

interface Props extends SelectProps<object> {
  button?: React.ComponentProps<typeof Button>
  label?: LabelProps
  popover?: React.ComponentProps<typeof Popover>
  listBox?: ListBoxProps<object>
  items?: React.PropsWithChildren<
    Omit<React.ComponentProps<typeof ListBoxItem>, "className" | "children"> & {
      className?: string
    }
  >[]
}

const Dropdown = ({
  button,
  label,
  popover,
  listBox,
  items,
  ...props
}: Props) => {
  return (
    <Select {...props} placeholder="Select">
      <Label {...label} />
      <Button
        variant="plain"
        {...button}
        className={cn(
          "flex h-8 w-full items-center rounded-md border border-gray-200 px-2 leading-8",
          button?.className,
        )}
      >
        <SelectValue
          className="flex-1 text-left text-inherit"
          defaultValue={""}
        />
        <span aria-hidden="true">
          <CaretDown />
        </span>
      </Button>
      <Popover
        {...popover}
        className={
          typeof popover?.className === "function"
            ? popover.className
            : cn("min-w-[--trigger-width]", popover?.className)
        }
      >
        {items ? (
          <ListBox {...listBox}>
            {items.map((item) => (
              <ListBoxItem
                key={item.id}
                {...item}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-x-2 px-2 leading-8 outline-none focus:bg-slate-50",
                  item.className,
                  item.isDisabled ? "text-gray-400" : "",
                )}
              />
            ))}
          </ListBox>
        ) : (
          popover?.children ?? null
        )}
      </Popover>
    </Select>
  )
}

export default Dropdown
