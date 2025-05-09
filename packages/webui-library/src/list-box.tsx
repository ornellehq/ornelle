import { motion } from "framer-motion"
import { ListBox as AriaListBox } from "react-aria-components"
import { cn } from "./utils/cn"

const MotionAriaListBox = motion(AriaListBox)

interface ListBoxProps
  extends Omit<React.ComponentProps<typeof MotionAriaListBox>, "className"> {
  className?: string
}

const ListBox = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<ListBoxProps>) => {
  return (
    <MotionAriaListBox
      className={cn("rounded-lg outline-none", className)}
      {...props}
    >
      {children}
    </MotionAriaListBox>
  )
}

export default ListBox
