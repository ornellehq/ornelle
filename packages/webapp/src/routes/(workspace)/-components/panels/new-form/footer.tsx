import type { FormState } from "react-hook-form"
import { Button } from "webui-library/src/button"
import type { FormFieldValues } from "./utils"

const FormEditFooterDefault = ({
  formState,
}: { formState: FormState<FormFieldValues> }) => {
  return (
    <div className="flex items-center border-gray-200 border-t border-solid bg-gray-50 px-4 py-3">
      <div className="flex-1" />
      <Button
        type="submit"
        variant={"elevated"}
        className="px-2 [--spacing-9:1.5rem]"
        isDisabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? "Creating" : "Create"}
      </Button>
    </div>
  )
}

export default FormEditFooterDefault
