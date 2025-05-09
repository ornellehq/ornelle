import { type VariantProps, cva } from "class-variance-authority"
import { motion } from "framer-motion"
import { type ComponentProps, forwardRef } from "react"
import { Input } from "react-aria-components"
import { cn } from "./utils/cn"

const variants = cva("h-[--spacing-9] w-full rounded-md ", {
  variants: {
    variant: {
      default:
        "border border-gray-300 px-2 invalid:ring-2 invalid:ring-red-100 disabled:bg-white disabled:opacity-40",
      plain: "border-none outline-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const MotionTextFieldInput = motion(Input)

interface TextFieldInputProps
  extends Omit<ComponentProps<typeof MotionTextFieldInput>, "className">,
    VariantProps<typeof variants> {
  className?: string
}

export const TextFieldInput = forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ variant, className, ...props }, ref) => (
    <MotionTextFieldInput
      ref={ref}
      {...props}
      className={cn(variants({ variant, className }))}
    />
  ),
)

export default TextFieldInput
