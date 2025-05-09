import type { ComponentProps, PropsWithChildren } from "react"
import {
  Calendar as AriaCalendar,
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  type ButtonProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  type DatePickerProps,
  DateSegment,
  type DateValue,
  Group,
  type PopoverProps,
} from "react-aria-components"
import { Button } from "../button"
import Dialog from "../dialog"
import Heading from "../heading"
import CaretDown from "../icons/CaretDown"
import CaretRight from "../icons/CaretRight"
import Popover from "../popover"
import { cn } from "../utils/cn"

interface Props<T extends DateValue> extends DatePickerProps<T> {
  popover?: PopoverProps
}

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border-0 bg-transparent pressed:bg-gray-200 text-gray-600 outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring"
    />
  )
}

export const DateInput = (
  props: PropsWithChildren<
    Omit<ComponentProps<typeof AriaDateInput>, "children">
  >,
) => {
  return (
    <AriaDateInput
      {...props}
      className={
        typeof props.className === "function"
          ? props.className
          : cn(props.className, "flex flex-1 text-inherit")
      }
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className="self-center rounded-sm px-0.5 text-inherit tabular-nums caret-transparent outline-none placeholder-shown:italic focus:bg-violet-700 focus:text-white"
        />
      )}
    </AriaDateInput>
  )
}

export const DateField = (props: ComponentProps<typeof AriaDateField>) => {
  return (
    <AriaDateField
      {...props}
      className={
        typeof props.className === "function"
          ? props.className
          : cn(props.className, "flex flex-1 text-inherit")
      }
    >
      <DateInput />
    </AriaDateField>
  )
}

export const Calendar = (props: ComponentProps<typeof AriaCalendar>) => {
  return (
    <AriaCalendar {...props}>
      <header className="flex w-full items-center gap-1 px-1 pb-4 font-serif">
        <Heading className="ml-2 flex-1 font-semibold text-2xl" />
        <RoundButton slot="previous">
          <CaretRight className="-rotate-180 transform" />
        </RoundButton>
        <RoundButton slot="next">
          <CaretRight />
        </RoundButton>
      </header>
      <CalendarGrid className="border-separate border-spacing-1">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="font-semibold text-gray-500 text-xs">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="flex h-9 w-9 cursor-default items-center justify-center rounded-full pressed:bg-gray-200 selected:bg-violet-700 outside-month:text-gray-300 selected:text-white outline-none ring-violet-600/70 ring-offset-2 hover:bg-gray-100 focus-visible:ring"
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  )
}

const DatePicker = <T extends DateValue>({
  className,
  popover,
  ...datePickerProps
}: Props<T>) => {
  return (
    <AriaDatePicker
      {...datePickerProps}
      className={
        typeof className === "function"
          ? className
          : cn("group flex flex-col gap-1", className)
      }
    >
      <Group className="flex transition focus-within:bg-white focus-visible:ring-2 group-open:bg-white">
        <DateInput />
        <Button
          // onPress={() => setOpen(!open)}
          className="flex items-center rounded-r-lg border-0 border-l border-l-purple-200 border-solid bg-transparent pressed:bg-purple-100 px-3 text-gray-700 outline-none ring-black transition focus-visible:ring-2"
        >
          <CaretDown />
        </Button>
      </Group>
      <Popover {...popover}>
        <Dialog className="p-6 text-gray-600">
          <Calendar />
        </Dialog>
      </Popover>
    </AriaDatePicker>
  )
}

export default DatePicker
