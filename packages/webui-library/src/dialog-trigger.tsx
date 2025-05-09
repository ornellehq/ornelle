import { DialogTrigger as AriaDialogTrigger } from "react-aria-components"

interface DialogTriggerProps
  extends Omit<React.ComponentProps<typeof AriaDialogTrigger>, "className"> {
  className?: string
}

const DialogTrigger = ({
  children,
  ...props
}: React.PropsWithChildren<DialogTriggerProps>) => {
  return <AriaDialogTrigger {...props}>{children}</AriaDialogTrigger>
}

export default DialogTrigger
