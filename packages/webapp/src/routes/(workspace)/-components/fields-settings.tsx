import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import ListView from "webui-library/src/icons/ListView"
import Popover from "webui-library/src/popover"

const FieldsSettings = () => {
  return (
    <DialogTrigger>
      <Button
        variant={"plain"}
        className="flex h-6 w-auto items-center gap-x-1 rounded-md border border-gray-200 border-solid px-1 shadow-sm"
      >
        <ListView width={14} height={14} />
      </Button>
      <Popover placement="bottom right">
        <Dialog className="h-96 w-80">Settings</Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default FieldsSettings
