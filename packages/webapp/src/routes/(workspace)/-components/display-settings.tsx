import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import DisplayView from "webui-library/src/icons/PropertyView"
import Popover from "webui-library/src/popover"

const DisplaySettings = () => {
  return (
    <DialogTrigger>
      <Button
        variant={"plain"}
        className="flex h-6 w-auto items-center gap-x-1 rounded-md px-1"
      >
        <DisplayView width={16} height={16} />
        <span>Customize view</span>
      </Button>

      <Popover placement="bottom left">
        <Dialog className="h-96 w-80">Settings</Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default DisplaySettings
