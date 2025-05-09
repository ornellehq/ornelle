import type { PropsWithChildren } from "react"
import Logo from "~/assets/logo"

const WelcomeLayout = ({ children }: PropsWithChildren<object>) => {
  return (
    <div className="flex h-full w-full max-w-96 flex-col">
      <div className="flex flex-1 flex-col justify-center">{children}</div>

      <Logo width={120} className="mx-auto mb-10 text-gray-300" />
    </div>
  )
}

export default WelcomeLayout
