import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import CaretRight from "webui-library/src/icons/CaretRight"
import { TextFieldInput } from "webui-library/src/text-field-input"
import { TextFieldManager } from "webui-library/src/text-field-manager"
import { workspaceApi } from "~/core/workspace/api"
import WelcomeLayout from "../-components/WelcomeLayout"
import WelcomeTitle from "../-components/WelcomeTitle"
import WelcomeForm from "../-components/welcome-form"

export const Route = createFileRoute("/(user)/u/workspaces/create")({
  component: CreateWorkspace,
})

interface FormValues {
  name: string
}

function CreateWorkspace() {
  const navigate = useNavigate()
  const { control, handleSubmit, formState, setError } = useForm<FormValues>()
  const onSubmit = handleSubmit(async (values) => {
    const result = await workspaceApi
      .createWorkspace({
        createWorkspaceRequest: { name: values.name },
      })
      .catch(() => {
        setError("root", {
          message:
            "We're sorry. An error occurred. Try again in a few minutes.",
        })
      })

    if (result)
      navigate({ to: "/w/$code", params: { code: result.url }, replace: true })
  })

  return (
    <WelcomeLayout>
      <Link
        to="/u/workspaces"
        className="mb-6 flex items-center gap-x-1 text-gray-500"
      >
        <CaretRight className="-rotate-180 transform" />
        <span>Back to Workspaces</span>
      </Link>

      <WelcomeTitle>
        Create a Workspace
        <div className="mt-2 text-gray-500 text-sm">
          Please enter your workspace name to continue
        </div>
      </WelcomeTitle>

      <WelcomeForm
        onSubmit={onSubmit}
        formState={formState}
        button={{
          children: <span>Create workspace</span>,
        }}
      >
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Please enter a workspace name",
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
                aria-label="Workspace name"
                className=""
                isRequired
                validationBehavior="aria"
              >
                <TextFieldInput
                  variant="plain"
                  ref={field.ref}
                  type="text"
                  aria-labelledby="Workspace name"
                  className="h-12 px-3 text-gray-500 leading-[3rem]"
                  placeholder="Enter workspace name"
                  onChange={field.onChange}
                  value={field.value}
                  autoFocus
                  required
                  disabled={formState.isSubmitting}
                />
              </TextFieldManager>
            )
          }}
        />
      </WelcomeForm>
    </WelcomeLayout>
  )
}
