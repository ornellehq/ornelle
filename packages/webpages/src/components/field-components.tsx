import type { FormField } from "isomorphic-blocs/src/types/form.js"
import FileUpload from "./icons/file-upload"

type Props = {
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  labelProps: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
  className?: string
  error?: React.ReactNode
}

const FloatingLabelInput = ({ inputProps, labelProps, error }: Props) => {
  return (
    <div className={"flex-1"}>
      <div
        className={
          "relative flex-1 rounded-md border border-gray-200 text-gray-500"
        }
      >
        <input
          type="text"
          // id="floating_outlined"

          placeholder=" "
          {...inputProps}
          className={
            "peer block w-full appearance-none border-none bg-transparent px-2.5 pt-5 pb-1.5 text-gray-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-base"
          }
        />
        <label
          // htmlFor="floating_outlined"
          className="-translate-y-1 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1 absolute top-2 left-1 z-10 origin-[0] scale-75 transform whitespace-nowrap px-2 text-inherit text-sm duration-300 ease-out will-change-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 lg:text-base peer-focus:dark:text-blue-500"
          {...labelProps}
        >
          {/* Floating outlined */}
        </label>
      </div>
      {error ? (
        <span className="mt-1 inline-block font-medium text-red-600 text-sm">
          {error}
        </span>
      ) : null}
    </div>
  )
}

// const TextComponent = (
//   props: {} & DetailedHTMLProps<
//     React.InputHTMLAttributes<HTMLInputElement>,
//     HTMLInputElement
//   >,
// ) => {
//   return (
//     <input
//       {...props}
//       className="h-10 border-gray-300 border-b bg-white bg-opacity-55 px-2 leading-10"
//     />
//   )
// }

export const fieldComponents: Partial<
  Record<
    FormField["type"] | "resume" | "toggle",
    React.FunctionComponent<{
      name: string
      onChange(val: unknown): void
      value: unknown
      disabled: boolean
      attributeConfiguration?: unknown
    }>
  >
> = {
  text: ({ value, onChange, name, disabled }) => {
    return (
      <FloatingLabelInput
        inputProps={{
          value: value as string,
          onChange: (ev) => {
            onChange(ev.target.value)
          },
          id: name,
          disabled,
        }}
        labelProps={{
          children: name,
          htmlFor: name,
        }}
      />
    )
  },
  url: ({ value, onChange, name, disabled }) => {
    return (
      <FloatingLabelInput
        inputProps={{
          type: "url",
          value: value as string,
          onChange: (ev) => {
            onChange(ev.target.value)
          },
          id: name,
          disabled,
        }}
        labelProps={{
          children: name,
          htmlFor: name,
        }}
      />
    )
  },
  email: ({ value, onChange, name, disabled }) => {
    return (
      <FloatingLabelInput
        inputProps={{
          type: "email",
          value: value as string,
          onChange: (ev) => {
            onChange(ev.target.value)
          },
          id: name,
          disabled,
        }}
        labelProps={{
          children: name,
          htmlFor: name,
        }}
      />
    )
  },
  number: ({ value, onChange, name, disabled }) => {
    return (
      <div className="flex-1">
        <div className="relative flex-1 rounded-md border border-gray-200 text-gray-500">
          <input
            type="number"
            value={value as number}
            onChange={(ev) => {
              const val = ev.target.value ? Number(ev.target.value) : ""
              onChange(val)
            }}
            id={name}
            placeholder=" "
            disabled={disabled}
            className="peer block w-full appearance-none border-none bg-transparent px-2.5 pt-5 pb-1.5 text-gray-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <label
            htmlFor={name}
            className="-translate-y-1 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1 absolute top-2 left-1 z-10 origin-[0] scale-75 transform whitespace-nowrap px-2 text-inherit text-sm duration-300 ease-out will-change-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 lg:text-base peer-focus:dark:text-blue-500"
          >
            {name}
          </label>
        </div>
      </div>
    )
  },
  phone: ({ value, onChange, name, disabled }) => {
    const formatPhoneNumber = (input: string) => {
      // Remove all non-digit characters
      const cleaned = input.replace(/\D/g, "")
      // Format the number as (XXX) XXX-XXXX
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
      if (!match) return input
      const [, area, prefix, line] = match

      if (!area) return ""
      if (!prefix) return `(${area}`
      if (!line) return `(${area}) ${prefix}`
      return `(${area}) ${prefix}-${line}`
    }

    return (
      <div className="flex-1">
        <div className="relative flex-1 rounded-md border border-gray-200 text-gray-500">
          <input
            type="tel"
            value={(value as string) ?? ""}
            onChange={(ev) => {
              // const formatted = formatPhoneNumber(ev.target.value)
              onChange(ev.target.value)
            }}
            id={name}
            placeholder=" "
            disabled={disabled}
            className="peer block w-full appearance-none border-none bg-transparent px-2.5 pt-5 pb-1.5 text-gray-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-base"
          />
          <label
            htmlFor={name}
            className="-translate-y-1 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1 absolute top-2 left-1 z-10 origin-[0] scale-75 transform whitespace-nowrap px-2 text-inherit text-sm duration-300 ease-out will-change-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 lg:text-base peer-focus:dark:text-blue-500"
          >
            {name}
          </label>
        </div>
      </div>
    )
  },
  resume: ({ value: _value, onChange, disabled }) => {
    const value = _value as File | undefined
    return (
      <div className="flex items-center text-[13px] text-gray-600 leading-10">
        <div className="relative flex flex-1 cursor-pointer items-center gap-x-3 rounded-lg border border-gray-400 border-dashed px-3 ring-gray-100 focus-within:ring-4 hover:ring-4">
          <FileUpload className="w-4" />{" "}
          <span className="">{value ? value.name : "Upload your resume"}</span>
          <input
            tabIndex={0}
            type="file"
            className="absolute inset-0 opacity-0"
            max={1024 * 1024 * 3.5}
            maxLength={1}
            onChange={(ev) => onChange(ev.target.files?.item(0))}
            disabled={disabled}
          />
        </div>
        <div className="px-3 text-gray-400">
          Resume should be a PDF under 3.5MB
        </div>
      </div>
    )
  },
  toggle: ({ value: _value, onChange, disabled, name }) => {
    const value = _value as boolean

    return (
      <label className="mt-2 flex-1 pb-1">
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 ${
              value ? "bg-rose-400" : "bg-gray-200"
            }${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <span
              className={`${
                value ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
            />
          </button>
          <div className="cursor-pointer text-gray-900 text-sm lg:text-base">
            {name}
          </div>
        </div>
      </label>
    )
  },
  select: ({
    value: _value,
    onChange,
    disabled,
    attributeConfiguration,
    name,
  }) => {
    const value = _value as string
    const configuration = attributeConfiguration as { options: string[] }

    return (
      <div className="flex-1">
        <div className="relative flex-1 rounded-md border border-gray-200 text-gray-500">
          <select
            value={value}
            onChange={(ev) => onChange(ev.target.value)}
            disabled={disabled}
            id={name}
            className="peer block w-full appearance-none border-none bg-transparent px-2.5 pt-5 pb-1.5 text-gray-900 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-base"
          >
            <option value="">Select</option>
            {configuration?.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label
            htmlFor={name}
            className="-translate-y-1 peer-placeholder-shown:-translate-y-1/2 peer-focus:-translate-y-1 absolute top-2 left-1 z-10 origin-[0] scale-75 transform whitespace-nowrap px-2 text-inherit text-sm duration-300 ease-out will-change-auto peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 lg:text-base peer-focus:dark:text-blue-500"
          >
            {name}
          </label>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Down arrow</title>
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    )
  },
}

export default fieldComponents
