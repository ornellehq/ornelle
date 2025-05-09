import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { Form } from "webui-library/src/form"
import { TextFieldInput } from "webui-library/src/text-field-input"

interface RenameFormProps {
  name: string
  onSubmit: SubmitHandler<{ name: string }>
  dismiss: () => void
}

export const RenameForm = ({
  name,
  onSubmit: _onSubmit,
  dismiss,
}: RenameFormProps) => {
  const { control, handleSubmit } = useForm<{ name: string }>({
    defaultValues: { name },
  })
  const onSubmit = handleSubmit(_onSubmit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault()
      dismiss()
    }
  }

  return (
    <Form onSubmit={onSubmit} className="-ml-1 relative z-50">
      <Controller
        control={control}
        name="name"
        render={({ field }) => {
          return (
            <TextFieldInput
              autoFocus
              variant="plain"
              value={field.value}
              onChange={field.onChange}
              className="h-5 rounded-md border border-gray-200 bg-transparent px-1 leading-5"
              onKeyDown={handleKeyDown}
            />
          )
        }}
      />
    </Form>
  )
}
