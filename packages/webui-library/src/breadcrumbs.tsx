import type { ComponentProps } from "react"
import {
  Breadcrumbs as AriaBreadCrumbs,
  Breadcrumb,
  Link,
} from "react-aria-components"
import CaretRight from "~icons/hugeicons/arrow-right-01"
import { cn } from "./utils/cn"

interface Props
  extends Omit<ComponentProps<typeof AriaBreadCrumbs>, "className"> {
  className?: string
  breadcrumbs: (Omit<ComponentProps<typeof Breadcrumb>, "className"> & {
    link?: string
    className?: string
  })[]
}

const Breadcrumbs = ({ className, breadcrumbs, ...props }: Props) => {
  return (
    <AriaBreadCrumbs {...props} className={cn("flex items-center", className)}>
      {breadcrumbs.map(
        ({ link, children, className, ...breadcrumb }, index) => {
          return (
            <Breadcrumb
              key={breadcrumb.id}
              {...breadcrumb}
              className={cn(
                "flex items-center text-slate-500 last:text-black",
                className,
              )}
            >
              {index !== 0 ? (
                <CaretRight width={10} height={10} className="mx-1 mt-0.5" />
              ) : null}
              {link ? <Link href={link}>{children}</Link> : children}
            </Breadcrumb>
          )
        },
      )}
    </AriaBreadCrumbs>
  )
}

export default Breadcrumbs
