import type { LabelProps } from "react-aria-components"
import { Label as AriaLabel } from "react-aria-components"
import { cn } from "./utils/cn"

export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <AriaLabel
      className={
        typeof className === "function"
          ? className
          : cn("text-gray-500", className)
      }
      {...props}
    >
      {children}
    </AriaLabel>
  )
}

export default Label
