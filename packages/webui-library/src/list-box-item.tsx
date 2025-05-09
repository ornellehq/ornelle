import { motion } from "framer-motion"
// I'm alright. Let's go get it.
import { ListBoxItem as AriaListBoxItem } from "react-aria-components"
import { cn } from "./utils/cn"

const MotionAriaListBoxItem = motion(AriaListBoxItem)

interface ListBoxItemProps
  extends Omit<
    React.ComponentProps<typeof MotionAriaListBoxItem>,
    "className"
  > {
  className?: string
}

const ListBoxItem = ({
  children,
  ...props
}: React.PropsWithChildren<ListBoxItemProps>) => {
  return (
    <MotionAriaListBoxItem
      {...props}
      className={cn("cursor-pointer", props.className)}
    >
      {children}
    </MotionAriaListBoxItem>
  )
}

export default ListBoxItem
