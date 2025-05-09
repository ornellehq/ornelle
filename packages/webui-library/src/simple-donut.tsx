interface DonutChartProps extends React.SVGProps<SVGSVGElement> {
  percentage: number
  title?: string
  width: number
}

const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  width,
  title = "Donut chart",
  ...props
}: DonutChartProps) => {
  const radius = width / 4
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg
      {...props}
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      className="p-0.5"
    >
      <title>{title}</title>
      <circle
        cx={radius}
        cy={radius}
        r={radius - 1}
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth={2}
      />
      <circle
        cx={radius}
        cy={radius}
        r={radius - 1}
        fill="transparent"
        stroke="#4CAF50"
        strokeWidth={2}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
    </svg>
  )
}

export default DonutChart
