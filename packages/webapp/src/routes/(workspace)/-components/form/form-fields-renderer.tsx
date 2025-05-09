import { getLocalTimeZone, parseAbsolute } from "@internationalized/date"
import type { FormField } from "isomorphic-blocs/src/types/form"
import { TextFieldInput } from "webui-library/src/text-field-input"
import DatePicker from "webui-library/src/widgets/date-picker"
import Dropdown from "webui-library/src/widgets/dropdown"

const textFieldTypes: FormField["type"][] = [
  "text",
  "number",
  "email",
  "url",
  "phone",
]

interface FormFieldsRendererProps {
  fields: FormField[]
  value: {
    id: string
    answer: unknown
    question: string
    type: FormField["type"]
  }[]
  onChange: (
    value: {
      id: string
      answer: string
      question: string
      type: FormField["type"]
    }[],
  ) => void
}

const FormFieldsRenderer = ({
  fields,
  value,
  onChange,
}: FormFieldsRendererProps) => {
  return (
    <ul className="mb-8 flex flex-col gap-y-2.5">
      {fields.map((field) => {
        const { name, type, id } = field

        // TODO: Support file field response
        if (type === "file") return null

        const setField = (id: string, val: string) => {
          const index = value.findIndex((response) => response.id === id)
          const _value = [...value]
          const newResponse = {
            id,
            question: name,
            answer: val,
            type,
          }
          if (index > -1) {
            _value[index] = newResponse
            onChange(_value)
          } else {
            onChange([..._value, newResponse])
          }
        }
        const fieldValue = value.find((response) => response.id === id)
          ?.answer as string
        const timeZone = getLocalTimeZone()

        return (
          <li key={id} className="mb-2">
            <div className="mb-1 text-xs">{name}</div>
            {textFieldTypes.includes(type) ? (
              <TextFieldInput
                aria-label={name}
                value={fieldValue ?? ""}
                type={type}
                className="h-9 border-gray-300 leading-9 shadow-sm"
                onChange={(ev) => {
                  setField(id, ev.target.value)
                }}
              />
            ) : null}
            {type === "select" ? (
              <Dropdown
                selectedKey={fieldValue}
                button={{
                  className: "h-9 leading-9 border-gray-300 shadow-sm",
                }}
                items={field.options.map((name) => ({
                  id: name,
                  children: name,
                }))}
                onSelectionChange={(key) => {
                  setField(id, key as string)
                }}
              />
            ) : null}
            {type === "date" ? (
              <DatePicker
                {...(fieldValue
                  ? {
                      value: parseAbsolute(fieldValue, timeZone),
                    }
                  : {})}
                granularity="day"
                className="rounded-md border border-gray-300 pl-1 shadow-sm"
                onChange={(date) => {
                  const newValue = date.toDate(timeZone).toISOString()
                  setField(id, newValue)
                }}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export default FormFieldsRenderer
