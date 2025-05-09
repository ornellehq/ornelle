import type { SVGProps } from "react"

const FileUpload = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <title>File Upload</title>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      color="currentColor"
    >
      <path d="M12.5 2h.273c3.26 0 4.892 0 6.024.798.324.228.612.5.855.805.848 1.066.848 2.6.848 5.67v2.545c0 2.963 0 4.445-.469 5.628-.754 1.903-2.348 3.403-4.37 4.113-1.257.441-2.83.441-5.98.441-1.798 0-2.698 0-3.416-.252-1.155-.406-2.066-1.263-2.497-2.35-.268-.676-.268-1.523-.268-3.216V12" />
      <path d="M20.5 12a3.333 3.333 0 0 1-3.333 3.333c-.666 0-1.451-.116-2.098.057a1.67 1.67 0 0 0-1.179 1.179c-.173.647-.057 1.432-.057 2.098A3.333 3.333 0 0 1 10.5 22m-6-17.5C4.992 3.994 6.3 2 7 2m2.5 2.5C9.008 3.994 7.7 2 7 2m0 0v8" />
    </g>
  </svg>
)

export default FileUpload
