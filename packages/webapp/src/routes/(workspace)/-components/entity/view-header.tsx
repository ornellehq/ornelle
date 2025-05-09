import { motion } from "framer-motion"
import { Button } from "webui-library/src/button"
import { useWorkspaceContext } from "~/core/workspace/workspace.context"
import type { BreadCrumb } from "~/types"
import TopBar from "../top-bar"
import ViewCustomizationBar from "../view-customization-bar"
import { useViewContext } from "./view.context"

interface Props {
  breadCrumbs: BreadCrumb[]
}

const ViewHeader = ({ breadCrumbs }: Props) => {
  const { appState, setAppState } = useWorkspaceContext()
  const isNewView = appState.entityView === "new"
  const { viewName, setViewName } = useViewContext()

  return (
    <>
      {isNewView ? (
        <Button
          variant="plain"
          className="fixed inset-0 z-40 cursor-pointer bg-black bg-opacity-[0.01] hover:bg-black hover:bg-opacity-[0.01] focus:bg-black focus:bg-opacity-[0.01]"
          onPress={() => {
            setAppState((state) => ({ ...state, entityView: "default" }))
          }}
        />
      ) : null}
      <motion.div
        layout="position"
        className={`flex flex-col ${isNewView ? "relative z-50 mt-3 w-[calc(100%_-_32px)] self-center rounded-xl border border-gray-200 shadow-2xl" : "w-full"}`}
      >
        <TopBar
          breadCrumbs={breadCrumbs}
          viewName={viewName}
          onViewNameChange={setViewName}
        />
        <ViewCustomizationBar />
      </motion.div>
    </>
  )
}

export default ViewHeader
