import type {
  FormAttributeLink,
  FormField,
} from "isomorphic-blocs/src/types/form.js"
import { useLayoutEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import fieldComponents from "./field-components.js"

interface Props {
  fields: (FormField & {
    attributeLinked: FormAttributeLink & {
      attributeConfiguration: unknown
    }
  })[]
  url: string
  openingId: string
}

const ApplicationForm = ({ fields, url, openingId }: Props) => {
  const form = useForm()
  const ref = useRef<HTMLDivElement>(null)
  const [applying, setApplying] = useState(false)
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const formData = new FormData()
      Object.entries(values).map(([key, value]) => {
        const field = fields.find((field) =>
          field.attributeLinked
            ? field.attributeLinked.id === key
            : field.id === key,
        )
        if (key === "resumeLink") {
          formData.append("file", value)
        } else if (field?.type === "toggle") {
          formData.append(key, value ? "Yes" : "No")
        } else {
          formData.append(key, value)
        }
      })
      formData.append("openingId", openingId)

      // return
      // Use the new Astro API endpoint instead of direct API call
      const res = await fetch(`/j/${url}/submit-application.api`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Failed to submit application: ${res.statusText}`)
      }

      // Still record the email cookie for "Applied" state
      const rememberRes = await fetch(`${location.pathname}.api`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
        }),
        headers: {
          "content-type": "application/json",
        },
      })

      if (!rememberRes.ok) {
        console.error(
          "Failed to save application state",
          await rememberRes.text(),
        )
      }

      location.reload()
    } catch (error) {
      console.error("Error submitting application:", error)
      // Could add error handling UI here
    }
  })

  useLayoutEffect(() => {
    if (applying) {
      ref.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [applying])

  return (
    <>
      {applying ? (
        <div ref={ref} className="rounded-xl bg-gray-100 p-5">
          <div className="mb-4 text-[13px] text-gray-600">Application form</div>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-y-4 rounded-lg border border-gray-100 bg-white p-10"
          >
            {fields.map((field) => {
              const { id, name, type, attributeLinked, required } = field
              const Component =
                type === "file" && attributeLinked?.id === "resumeLink"
                  ? fieldComponents.resume
                  : fieldComponents[type]

              return (
                <Controller
                  key={id}
                  name={attributeLinked?.id ?? id}
                  control={form.control}
                  rules={{
                    required: required ? "Required" : false,
                  }}
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col gap-y-1">
                        {/* <label htmlFor={id} className="text-sm text-gray-800">
                          {name}
                        </label> */}
                        {Component ? (
                          <Component
                            name={name}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={form.formState.isSubmitting}
                            attributeConfiguration={
                              attributeLinked?.attributeConfiguration
                            }
                          />
                        ) : null}
                        <span className="text-red-500 text-xs">
                          {
                            form.formState.errors[attributeLinked?.id ?? id]
                              ?.message
                          }
                        </span>
                      </div>
                    )
                  }}
                />
              )
            })}
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="mt-3 h-11 w-full rounded-md bg-gradient-to-b from-gray-600 to-black px-4 text-[13px] text-white leading-[44px]"
            >
              {form.formState.isSubmitting ? "Submitting..." : "Apply"}
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setApplying(true)}
          className="h-11 w-full rounded-lg border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-300 px-4 text-[13px] text-gray-600 leading-[42px] shadow-2xl disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-500"
          // from-[#FBF4F0]
        >
          {form.formState.isSubmitting ? "Submitting..." : "Apply"}
        </button>
      )}
      {/* <button
        type="button"
        className="hidden h-12 leading-[3rem] px-4 text-sm text-left border border-rose-100 rounded-md bg-white shadow-borderNdFlatElevated"
      >
        Apply
      </button> */}
    </>
  )
}

export default ApplicationForm
