import type { PropsWithChildren } from "react"

interface CardProps {
  title: string
}

const Card = ({ title, children }: PropsWithChildren<CardProps>) => {
  return (
    <div className="flex max-h-[30rem] flex-col overflow-hidden rounded-lg border border-slate-200/70 bg-white shadow shadow-slate-300/60">
      <div className="h-7 items-center justify-between px-2.5 text-xs leading-7">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-400">{title}</h3>
        </div>
      </div>

      {children}
    </div>
  )
}

export default Card
