import type { ComponentProps } from "react"
import { Modal as AriaModal } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props extends Omit<ComponentProps<typeof AriaModal>, "className"> {
  className?: string
}

const Modal = ({ className, ...props }: Props) => {
  return <AriaModal {...props} className={cn("", className)} />
}

export default Modal
