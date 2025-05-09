import { Heading as AriaHeading } from "react-aria-components"

interface HeadingProps
  extends Omit<React.ComponentProps<typeof AriaHeading>, "className"> {
  className?: string
}

const Heading = ({
  children,
  ...props
}: React.PropsWithChildren<HeadingProps>) => {
  return <AriaHeading {...props}>{children}</AriaHeading>
}

export default Heading
