import type { PropsWithChildren } from "react"
import { TextArea as AriaTextArea } from "react-aria-components"
import { cn } from "./utils/cn"

interface TextAreaProps
  extends Omit<React.ComponentProps<typeof AriaTextArea>, "className"> {
  className?: string
}

export const TextArea = ({
  children,
  ...props
}: PropsWithChildren<TextAreaProps>) => (
  <AriaTextArea {...props} className={cn("w-full", props.className)}>
    {children}
  </AriaTextArea>
)
