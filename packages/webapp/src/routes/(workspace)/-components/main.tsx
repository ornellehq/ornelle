import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"

const Main = ({ children }: PropsWithChildren<object>) => {
  return (
    <main className="relative my-1 mr-1 flex-1 self-stretch overflow-hidden border border-transparent p-1 pl-0">
      <motion.div
        layout
        className="-z-0 absolute top-1 right-1 bottom-1 left-0 rounded-lg border border-gray-200 border-solid border-opacity-60 bg-white shadow-sm"
      />
      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-b-lg pl-[1px]">
        {children}
      </div>
    </main>
  )
}

export default Main

/**
 * Job overview in list - No of applicants, Interviewing
 */
