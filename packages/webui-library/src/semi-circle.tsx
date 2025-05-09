import { cn } from "./utils/cn"

interface Props extends React.SVGProps<SVGSVGElement> {
  title?: string
  percent: number
}

const SemiCircle = ({
  title = "Semi circle",
  percent,
  className,
  ...props
}: Props) => {
  const dashArrayOffset = `${percent} ${100}`

  return (
    <svg
      viewBox="0 0 64 64"
      fill="transparent"
      {...props}
      className={cn("w-5 overflow-hidden rounded-full", className)}
    >
      <title>{title}</title>
      <circle
        r="50%"
        cx="50%"
        cy="50%"
        // style="stroke-dasharray: 75.3 100"
        strokeDasharray={"75.3 100"}
      />
      <circle
        r="25%"
        cx="50%"
        cy="50%"
        // style="stroke-dasharray: 17 100; stroke: green; stroke-dashoffset: -75.3; animation-delay: 0.25s"
        strokeDasharray={dashArrayOffset}
        stroke="currentColor"
        strokeDashoffset={"-75.3"}
        fill="none"
        strokeWidth={32}
        className=""
      />
    </svg>
  )
}

export default SemiCircle
