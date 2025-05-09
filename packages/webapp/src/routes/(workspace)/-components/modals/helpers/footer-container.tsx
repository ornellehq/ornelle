import type { PropsWithChildren } from "react"

const FooterContainer = ({ children }: PropsWithChildren<object>) => {
  return (
    <div className="flex justify-end bg-gradient-to-t from-gray-100 to-white px-5 pt-3 pb-4">
      {children}
    </div>
  )
}

export default FooterContainer
