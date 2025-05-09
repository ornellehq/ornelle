import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import type { ResponseError } from "sdks/src/server-sdk"
import { P, match } from "ts-pattern"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { userApi } from "~/core/user/shared.js"
import WelcomeTitle from "../../-components/WelcomeTitle.js"
import WelcomeForm from "../../-components/welcome-form.js"

export const Route = createFileRoute("/(user)/(unauthorized)/welcome/email")({
  component: Email,
})

type SignInFieldValues = {
  email: string
}

function Email() {
  const navigate = useNavigate()
  const { control, handleSubmit, setError, formState } =
    useForm<SignInFieldValues>({})
  const submit = handleSubmit(async ({ email }) => {
    const setRootErrorMessage = (
      msg = "Our service is unavailable right now. Please try again shortly.",
    ) =>
      setError("root", {
        message: msg,
      })

    const result = await userApi
      .requestAuthentication({ email })
      .catch((reason) => {
        const error = reason as Error | ResponseError
        return error
      })

    match(result)
      .with({ response: { status: 400 } }, () => {
        setRootErrorMessage("Please check your email address.")
      })
      .with({ response: { status: P.number } }, () => {
        return setRootErrorMessage()
      })
      .with({ status: "Ok" }, () => {
        navigate({
          to: "/welcome/verify",
          search: { email: encodeURIComponent(email) },
        })
      })
      .otherwise(() => setRootErrorMessage)
  })

  return (
    <>
      <WelcomeTitle>
        Welcome
        <div className="mt-2 text-gray-500 text-sm">
          Please enter your email address to continue
        </div>
      </WelcomeTitle>

      <WelcomeForm onSubmit={submit} formState={formState}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Please enter an email address",
            validate: (email) => {
              const input = document.createElement("input")
              input.type = "email"
              input.value = email
              return (
                input.validity.valid || "Please enter a valid email address"
              )
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
                aria-label="Email address"
                className=""
                isRequired
                validationBehavior="aria"
              >
                <TextFieldInput
                  variant="plain"
                  ref={field.ref}
                  type="email"
                  aria-labelledby="Email address"
                  autoComplete="work email"
                  className="h-12 px-3 text-gray-500 leading-[3rem]"
                  placeholder="Enter email address"
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
    </>
  )
}
