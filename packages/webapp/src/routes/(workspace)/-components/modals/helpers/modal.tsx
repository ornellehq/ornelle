import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import Heading from "webui-library/src/heading"
import X from "webui-library/src/icons/X"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import { cn } from "webui-library/src/utils/cn"

interface ModalComponentProps
  extends React.ComponentProps<typeof ModalOverlay> {
  title: string
  Component: React.FunctionComponent
  close?(): void
}

const ModalComponent = ({
  title,
  Component,
  close = () => {},
  className,
  ...props
}: ModalComponentProps) => {
  return (
    <ModalOverlay
      {...props}
      isDismissable
      isKeyboardDismissDisabled
      isOpen={true}
      onOpenChange={close}
      className={cn(
        "fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-5",
        className,
      )}
    >
      <Modal className="">
        <Dialog className="min-h-48 overflow-hidden rounded-lg bg-white shadow md:min-w-[36rem]">
          <div className={"flex h-12 items-center justify-between px-5"}>
            <Heading slot="title" className="flex-1 text-[15px] text-gray-500">
              {title}
            </Heading>
            <Button variant={"plain"} onPress={close} className="">
              <X width={16} height={16} />
            </Button>
          </div>
          <Component />
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

export default ModalComponent
