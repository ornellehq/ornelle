import type { PropsWithChildren } from "react"
import type { TextFieldProps } from "react-aria-components"
import { TextField } from "react-aria-components"
import { cn } from "./utils/cn"

interface TextFieldManagerProps extends Omit<TextFieldProps, "className"> {
  className?: string
}

export const TextFieldManager = ({
  children,
  ...props
}: PropsWithChildren<TextFieldManagerProps>) => (
  <TextField
    {...props}
    className={cn("flex flex-col gap-y-[--spacing-1]", props.className)}
  >
    {children}
  </TextField>
)
