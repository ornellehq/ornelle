import { Dialog as AriaDialog } from "react-aria-components"
import { cn } from "./utils/cn"

interface DialogProps
  extends Omit<React.ComponentProps<typeof AriaDialog>, "className"> {
  className?: string
}

const Dialog = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<DialogProps>) => {
  return (
    <AriaDialog {...props} className={cn("outline-none", className)}>
      {children}
    </AriaDialog>
  )
}

export default Dialog
