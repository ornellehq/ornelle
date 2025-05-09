import type { FieldValues, FormState } from "react-hook-form"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import Alert from "webui-library/src/icons/alert"
import ArrowRight02 from "webui-library/src/icons/huge-icons/arrow-right-02"
import Loading03 from "webui-library/src/icons/huge-icons/loading-03"

const WelcomeForm = ({
  children,
  formState,
  button,
  ...props
}: React.ComponentProps<typeof Form> & {
  formState: FormState<FieldValues>
  button?: React.ComponentProps<typeof Button>
}) => {
  return (
    <>
      <Form
        layout
        layoutId="Welcome form"
        className="divide-y divide-gray-200 overflow-hidden rounded-md border border-gray-200 shadow-smallBottom"
        {...props}
      >
        {children}
        <div className="flex h-12 items-center justify-center">
          {formState.isSubmitting ? (
            <Loading03 width={20} className="animate-spin" />
          ) : (
            <Button
              variant="plain"
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-x-2 rounded-none leading-[3rem]"
              {...button}
            >
              {button?.children ?? <span>Continue</span>}
              <ArrowRight02 width={16} />
            </Button>
          )}
        </div>
      </Form>
      {formState.errors.root?.message ? (
        <div className="mt-4 flex items-center gap-x-1.5 text-red-500 text-xs">
          <Alert />
          <span>{formState.errors.root?.message}</span>
        </div>
      ) : null}
    </>
  )
}

export default WelcomeForm
