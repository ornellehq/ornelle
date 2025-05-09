import type { FieldErrorProps as AriaFieldErrorProps } from "react-aria-components"
import { FieldError as AriaFieldError } from "react-aria-components"
import { cn } from "./utils/cn"

interface FieldErrorProps extends Omit<AriaFieldErrorProps, "className"> {
  className?: string
}

export const FieldError = (props: FieldErrorProps) => (
  <AriaFieldError
    {...props}
    className={cn("mb-1 text-red-600 text-xs", props.className)}
  />
)
