import { useQuery } from "@tanstack/react-query"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Toaster } from "sonner"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import { cn } from "webui-library/src/utils/cn"
import { z } from "zod"
import { workspaceApi } from "~/core/workspace/api"
import { getWorkspaceInfo } from "~/core/workspace/utils"
import {
  type AppState,
  workspaceContext,
} from "~/core/workspace/workspace.context"
import ModalRenderer from "./-components/modal-renderer"
import { modalSchema, modalWithIdSchema } from "./-components/modals/util"
import PanelRenderer from "./-components/panel-renderer"

const createEntitySchema = z.union([
  z.object({
    id: z.enum(["cr8app", "cr8cdt", "cr8role", "cr8f", "jbl", "jbo"] as const),
  }),
  z.object({
    id: z.enum(["cr8et"] as const),
    tb: z.enum(["m", "a"] as const),
  }),
])

const entitySchema = z.object({
  id: z.enum(["role", "op", "fm", "ap", "cd", "et"] as const),
  e: z.string(),
})

const createOpeningSchema = z.object({
  id: z.enum(["cr8op"] as const),
  r: z.string().optional(),
})

const searchParamsSchema = z.object({
  drw: z
    .union([createEntitySchema, entitySchema, createOpeningSchema])
    .optional(),
  mdl: z.union([modalSchema, modalWithIdSchema]).optional(),
})

export const Route = createFileRoute("/(workspace)/w/$code")({
  component: Workspace,
  validateSearch: searchParamsSchema,
  pendingComponent: () => {
    return <>Loading...</>
  },
  preloadStaleTime: Number.POSITIVE_INFINITY,
  preloadGcTime: Number.POSITIVE_INFINITY,
})

function Workspace() {
  const { code } = Route.useParams()
  const { drw, mdl } = Route.useSearch()
  const [appState, setAppState] = useState<AppState>({
    entityView: "default",
    confirmationModal: null,
  })
  const confirmationModal = appState.confirmationModal
  const closeConfirmationModal = () =>
    setAppState((state) => ({
      ...state,
      confirmationModal: null,
    }))
  const { data, status } = useQuery({
    queryKey: ["workspace", code],
    queryFn: () => getWorkspaceInfo({ code, api: workspaceApi }),
    refetchOnWindowFocus: false,
  })

  if (status === "pending" || !data) return <div />

  return (
    <workspaceContext.Provider
      value={{ code, appState, setAppState, ...data }}
      key={code}
    >
      <Toaster position="bottom-left" />
      <div className="flex h-full w-full bg-gradient-to-br from-[#FAF5FA] via-[#FBF6FB] to-[#FBF6FB]">
        <Outlet />
        {drw ? <PanelRenderer drawer={drw} /> : null}
        {mdl ? <ModalRenderer modal={mdl} /> : null}
      </div>
      {confirmationModal ? (
        <ModalOverlay
          isDismissable
          isKeyboardDismissDisabled
          isOpen={!!appState.confirmationModal}
          onOpenChange={(open) => {
            if (!open) closeConfirmationModal()
          }}
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-15 backdrop-grayscale"
        >
          <Modal className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <Dialog className="">
              <h2 className="mb-2 font-semibold text-xl">
                {confirmationModal.title}
              </h2>
              <p className="text-gray-700">{confirmationModal.description}</p>
              <div className="mt-10 flex justify-end gap-x-3">
                <Button
                  autoFocus
                  variant="plain"
                  className="px-4"
                  onPress={closeConfirmationModal}
                >
                  Cancel
                </Button>
                <Button
                  {...confirmationModal.confirmButton}
                  className={cn(
                    "bg-red-600 px-4 outline-none ring-red-200 hover:bg-red-700 focus:bg-red-700 active:bg-red-800",
                    confirmationModal.confirmButton.className,
                  )}
                />
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      ) : null}
    </workspaceContext.Provider>
  )
}
