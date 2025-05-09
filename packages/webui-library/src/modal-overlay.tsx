import type { ComponentProps } from "react"
import { ModalOverlay as AriaModalOverlay } from "react-aria-components"
import { cn } from "./utils/cn"

interface Props
  extends Omit<ComponentProps<typeof AriaModalOverlay>, "className"> {
  className?: string
}

const ModalOverlay = ({ className, ...props }: Props) => {
  return <AriaModalOverlay {...props} className={cn("", className)} />
}

export default ModalOverlay
