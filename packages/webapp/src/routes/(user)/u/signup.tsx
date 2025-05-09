import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import type { ResponseError } from "sdks/src/server-sdk"
import { P, match } from "ts-pattern"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { resetUserQuery, userApi } from "~/core/user/shared"
import WelcomeLayout from "../-components/WelcomeLayout"
import WelcomeTitle from "../-components/WelcomeTitle"
import WelcomeForm from "../-components/welcome-form"

export const Route = createFileRoute("/(user)/u/signup")({
  component: Signup,
})

interface SignupFormValues {
  firstName: string
}

function Signup() {
  const navigate = useNavigate()
  const { control, handleSubmit, setError, formState } =
    useForm<SignupFormValues>()
  const onSubmit = handleSubmit(async ({ firstName }) => {
    const res = await userApi
      .createAUser({ createAUserRequest: { firstName } })
      .catch((reason) => {
        const error = reason as ResponseError | Error
        return error
      })

    await match(res)
      .with({ response: { status: 400 } }, async (_, v) => {
        const data = await v.response.json()
        setError("root", { message: data.message })
      })
      .with({ email: P.string }, () => {
        resetUserQuery()
        navigate({ to: "/u/workspaces/create" })
      })
      .otherwise(() => {
        setError("root", {
          message: "An error occurred. Please try again shortly",
        })
      })
  })

  return (
    <WelcomeLayout>
      <WelcomeTitle>
        Welcome
        <div className="mt-2 text-gray-500 text-sm">
          Please enter your first name to continue
        </div>
      </WelcomeTitle>

      <WelcomeForm
        onSubmit={onSubmit}
        formState={formState}
        button={{
          children: <span>Create account</span>,
        }}
      >
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: "Please enter a first name",
            minLength: {
              value: 2,
              message: "Name should be at least 2 characters",
            },
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => {
            return (
              <TextFieldManager
                isInvalid={invalid || !!errors.root?.message}
                aria-label="First name"
                className=""
                isRequired
                validationBehavior="aria"
              >
                <TextFieldInput
                  variant="plain"
                  ref={field.ref}
                  type="text"
                  aria-labelledby="First name"
                  autoComplete="given-name"
                  className="h-12 px-3 text-gray-500 leading-[3rem]"
                  placeholder="Enter first name"
                  onChange={field.onChange}
                  value={field.value}
                  autoFocus
                  required
                />
              </TextFieldManager>
            )
          }}
        />
      </WelcomeForm>
    </WelcomeLayout>
  )
}
