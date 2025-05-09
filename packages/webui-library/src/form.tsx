import { motion } from "framer-motion"
import { Form as AriaForm } from "react-aria-components"
import { cn } from "./utils/cn"

const MotionForm = motion(AriaForm)

interface FormProps
  extends Omit<React.ComponentProps<typeof MotionForm>, "className"> {
  className?: string
}

export const Form = (props: FormProps) => (
  <MotionForm {...props} className={cn("w-full", props.className)} />
)
