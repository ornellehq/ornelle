import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import type { ResponseError } from "sdks/src/server-sdk/runtime.js"
import { P, match } from "ts-pattern"
import { Button } from "webui-library/src/button.js"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { z } from "zod"
import { queryClient } from "~/core/network.js"
import { userApi } from "~/core/user/shared.js"
import WelcomeTitle from "../../-components/WelcomeTitle.js"
import WelcomeForm from "../../-components/welcome-form.js"

const searchParamsSchema = z.object({
  email: z.string().catch(""),
})

export const Route = createFileRoute("/(user)/(unauthorized)/welcome/verify")({
  component: Verify,
  validateSearch: searchParamsSchema,
})

interface FormFieldValues {
  email: string
  code: string
}

const resetUserQuery = () =>
  queryClient.resetQueries({ queryKey: [userApi.getCurrentUser.name] })

function Verify() {
  const navigate = useNavigate()
  const queryParams = Route.useSearch()
  const email = decodeURIComponent(queryParams.email)
  const [countdown, setCountdown] = useState(30)
  const { control, handleSubmit, setError, formState } =
    useForm<FormFieldValues>({
      defaultValues: { email },
    })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!email.trim()) {
    return redirect({ to: "/welcome/email" })
  }

  const onSubmit = handleSubmit(async (values) => {
    const setRootErrorMessage = (
      msg = "We couldn't log you in. Please try again shortly.",
    ) => setError("root", { message: msg })

    const result = await userApi
      .verifyAuthentication(values)
      .catch((reason) => reason as ResponseError | Error)
    await queryClient.invalidateQueries({ queryKey: ["user"] })

    match(result)
      .with({ response: { status: 400 } }, () => {
        setRootErrorMessage("Wrong or expired code.")
      })
      .with({ response: { status: P.number } }, () => {
        return setRootErrorMessage()
      })
      .with({ data: { id: P.string } }, () => {
        resetUserQuery()
        navigate({ to: "/u/workspaces" })
      })
      .with({ meta: { email: P.string } }, () => {
        resetUserQuery()
        navigate({ to: "/u/signup" })
      })
      .otherwise(() => setRootErrorMessage)
  })

  const handleResend = async () => {
    await userApi.requestAuthentication({ email })
    setCountdown(30)
  }

  return (
    <>
      <WelcomeTitle className="mb-6">
        You have mail!
        <p className="mt-2 text-gray-500 text-sm">
          We sent a code to{" "}
          <a
            href={`${email.includes("gmail") ? "https://mail.google.com" : `mailto:${email}`}`}
            target="__blank"
            className="underline"
          >
            {email}
          </a>
          , please enter it below.
        </p>
      </WelcomeTitle>

      <WelcomeForm onSubmit={onSubmit} formState={formState}>
        <Controller
          control={control}
          name="code"
          rules={{
            required: "Please enter the code sent to your email address",
            validate: (code) =>
              code?.replace(/\-/g, "").length === 12 ||
              "Please enter the code (including hyphens) sent to your email address",
          }}
          render={({
            field,
            fieldState: { invalid, error },
            formState: { errors },
          }) => (
            <TextFieldManager
              isInvalid={invalid || !!errors.root?.message}
              aria-label="Code"
              className=""
              isRequired
              validationBehavior="aria"
            >
              <TextFieldInput
                variant="plain"
                ref={field.ref}
                type="text"
                aria-labelledby="Code"
                autoComplete=""
                aria-autocomplete="none"
                className="h-12 px-3 text-gray-500 leading-[3rem] placeholder:text-gray-300"
                placeholder="xxxx-xxxx-xxxx"
                onChange={field.onChange}
                value={field.value}
                autoFocus
                required
                minLength={14}
                maxLength={14}
              />
            </TextFieldManager>
          )}
        />
      </WelcomeForm>
      <div className="mt-8 flex flex-col gap-y-2 text-left text-[13px] text-slate-400">
        <div className="mb-2 text-gray-500 text-xs">Having troubles?</div>
        <Link to="/welcome/email"> Log in with a different email</Link>
        <Button
          variant="plain"
          className="self-start text-left text-inherit hover:bg-transparent"
          onPress={handleResend}
          isDisabled={countdown > 0}
        >
          Resend code {countdown > 0 ? `(${countdown}s)` : null}
        </Button>
        {/* <Link to="/welcome/email"> Contact</Link> */}
      </div>
    </>
  )
}
