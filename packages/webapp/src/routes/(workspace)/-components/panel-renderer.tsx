import { useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import Heading from "webui-library/src/heading"
import X from "webui-library/src/icons/X"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import type { DrawerConfig, DrawerIDs } from "~/core/workspace/drawer/util"
import Role from "./panels/Role"
import Application from "./panels/application/application"
import NewApplication from "./panels/application/new-application"
import Candidate from "./panels/candidate/candidate"
import NewCandidate from "./panels/candidate/new-candidate"
import EmailTemplate from "./panels/email-template"
import Form from "./panels/form"
import JobBoardLandingLayout from "./panels/job-board/landing-layout"
import JobBoardOpeningLayout from "./panels/job-board/opening-layout"
import NewEmailTemplate from "./panels/new-email-template"
import NewForm from "./panels/new-form"
import NewRole from "./panels/new-role"
import NewOpening from "./panels/opening/new-opening"
import Opening from "./panels/opening/opening"

interface Props {
  drawer: DrawerConfig
}

interface PanelConfig {
  title: string
  Component: React.FunctionComponent<object>
}

const panelComponentNdIdMismatch =
  "Attempt to render wrong component for drawer ID"
const panels: Record<
  DrawerIDs | "cr8op" | "op",
  ((args: { drawer: DrawerConfig }) => PanelConfig) | PanelConfig
> = {
  cr8role: {
    title: "New role",
    Component: NewRole,
  },
  cr8app: {
    title: "New application",
    Component: NewApplication,
  },
  cr8cdt: {
    title: "New candidate",
    Component: NewCandidate,
  },
  cr8f: {
    title: "New form",
    Component: NewForm,
  },
  cr8et: ({ drawer }) => {
    if (drawer.id !== "cr8et") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "Message Template",
      Component: () => <NewEmailTemplate {...drawer} />,
    }
  },
  cr8op: ({ drawer }) => {
    if (drawer.id !== "cr8op") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "New opening",
      Component: () => <NewOpening {...(drawer.r ? { role: drawer.r } : {})} />,
    }
  },
  role: ({ drawer }) => {
    if (drawer.id !== "role") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "Role",
      Component: () => <Role id={drawer.e} />,
    }
  },
  op: ({ drawer }) => {
    if (drawer.id !== "op") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "",
      Component: () => <Opening id={drawer.e} />,
    }
  },
  fm: ({ drawer }) => {
    if (drawer.id !== "fm") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "Form",
      Component: () => <Form id={drawer.e} />,
    }
  },
  ap: ({ drawer }) => {
    if (drawer.id !== "ap") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "",
      Component: () => <Application id={drawer.e} />,
    }
  },
  cd: ({ drawer }) => {
    if (drawer.id !== "cd") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "Candidate",
      Component: () => <Candidate id={drawer.e} />,
    }
  },
  jbl: () => {
    return {
      title: "Job Board Landing",
      Component: JobBoardLandingLayout,
    }
  },
  jbo: () => {
    return {
      title: "Job Board Opening",
      Component: JobBoardOpeningLayout,
    }
  },
  et: ({ drawer }) => {
    if (drawer.id !== "et") throw new Error(panelComponentNdIdMismatch)

    return {
      title: "Email Template",
      Component: () => <EmailTemplate id={drawer.e} />,
    }
  },
}

const nonDialogIds: DrawerIDs[] = ["role", "op", "fm", "ap", "cd", "et"]
const PanelRenderer = ({ drawer }: Props) => {
  const navigate = useNavigate()
  const close = () => {
    navigate({ to: "." })
  }
  const panelConfig = panels[drawer.id]
  const { title, Component } = useMemo(() => {
    return panelConfig
      ? typeof panelConfig === "object"
        ? panelConfig
        : panelConfig({ drawer })
      : {
          title: "",
          Component: () => <></>,
        }
  }, [drawer, panelConfig])
  const isDialog = !nonDialogIds.includes(drawer.id)

  const content = (
    <motion.div
      layout
      layoutId="panel-container"
      id="panel-container"
      className="relative h-full 3xl:min-w-[30rem] min-w-[22rem] rounded-lg border border-gray-200 border-solid 2xl:min-w-[26rem]"
    >
      <motion.div
        initial={{
          transformOrigin: "100% 50%",
          zIndex: 0,
        }}
        animate={{
          scale: [0.975, 1],
          borderRadius: [24, 8],
        }}
        transition={{ ease: "easeOut" }}
        className="absolute inset-0 bg-white shadow-sm"
      />
      <motion.div
        animate={{
          opacity: [0.3, 1],
        }}
        transition={{ ease: "easeIn", delay: 0.06 }}
        className="relative z-10 flex h-full flex-col"
      >
        <div
          className={`flex items-center justify-between border-white border-b border-solid px-3 ${isDialog ? "h-9" : "h-10"}`}
        >
          <div className="flex items-center">
            {/* <Button
              variant={"plain"}
              onPress={close}
              className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-neutral-00"
            >
              <ArrowRightDouble width={16} />
            </Button> */}
            <Heading
              slot="title"
              id="panel-title-slot"
              className="mr-2 flex-1 text-gray-500 text-xs"
            >
              {title}
            </Heading>
            <div id="panel-left-render-slot" />
          </div>
          <div className="flex items-center">
            <div id="panel-right-render-slot" className="" />
            <Button variant={"plain"} onPress={close} className="">
              <X width={16} height={16} />
            </Button>
          </div>
        </div>
        <Component />
      </motion.div>
    </motion.div>
  )

  return !isDialog ? (
    <div className="p-2 pl-0">{content}</div>
  ) : (
    <ModalOverlay
      isDismissable
      isKeyboardDismissDisabled
      isOpen={true}
      onOpenChange={close}
      className="fixed inset-0 z-10 bg-black bg-opacity-5 backdrop-grayscale"
    >
      <Modal className="fixed top-0 right-0 bottom-0">
        <Dialog className="h-full p-3">{content}</Dialog>
      </Modal>
    </ModalOverlay>
  )
}

export default PanelRenderer

/**
 * What could be in the panel header: Up,down arrows, expand, more menu
 */
