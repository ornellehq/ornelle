import { motion } from "framer-motion"
import type { FormAttributeLink } from "isomorphic-blocs/src/types/form"
import { useCallback, useState } from "react"
import { GetAttributesEntityTypesEnum } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import CaretRight from "webui-library/src/icons/CaretRight"
import Link from "webui-library/src/icons/Link"
import ThreeDotsHorizontal from "webui-library/src/icons/ThreeDotsHorizontal"
import Popover from "webui-library/src/popover"
import { Switch } from "webui-library/src/switch"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useNewFormContext } from "./utils"

type View = "default" | "select-attribute"

const FieldAction = ({
  fieldId,
  allowLinking = true,
}: { fieldId: string; allowLinking?: boolean }) => {
  const { removeField, fields, updateField } = useNewFormContext()
  const [opened, setOpened] = useState(false)
  const field = fields.find(({ id }) => id === fieldId)
  const { data: attributes } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Candidate,
    GetAttributesEntityTypesEnum.Application,
  ])

  const [view, setView] = useState<View>("default")
  const onOpenChange = (isOpen: boolean) => {
    setOpened(isOpen)
    if (!isOpen) setView("default")
  }
  const attributesForFieldType = attributes.filter(
    (attribute) =>
      attribute.dataType.toLowerCase() === field?.type.toLowerCase(),
  )
  const candidatesAttributes = attributesForFieldType?.filter(
    (attribute) =>
      (attribute.entityType as unknown as GetAttributesEntityTypesEnum) ===
      GetAttributesEntityTypesEnum.Candidate,
  )
  const applicationsAttributes = attributesForFieldType?.filter(
    (attribute) =>
      (attribute.entityType as unknown as GetAttributesEntityTypesEnum) ===
      GetAttributesEntityTypesEnum.Application,
  )

  const linkCandidateAtttributeOptions: FormAttributeLink[] = [
    ...(field?.type === "text"
      ? ([
          {
            type: "built-in",
            id: "firstName",
            name: "First name",
            entity: "Candidate" as const,
          },
          {
            type: "built-in",
            id: "lastName",
            name: "Last name",
            entity: "Candidate" as const,
          },
        ] as const)
      : []),
    ...(field?.type === "email"
      ? ([
          {
            type: "built-in",
            id: "email",
            name: "Email",
            entity: "Candidate" as const,
          },
        ] as const)
      : []),
    ...candidatesAttributes.map((attribute) => ({
      type: "custom" as const,
      name: attribute.name,
      id: attribute.id,
      entity: "Candidate" as const,
    })),
  ]
  const linkApplicationAttributeOptions: FormAttributeLink[] = [
    ...(field?.type === "file"
      ? ([
          {
            type: "built-in",
            id: "resumeLink",
            name: "Resume",
            entity: "Application",
          },
        ] as const)
      : []),
    ...applicationsAttributes.map((attribute) => ({
      type: "custom" as const,
      name: attribute.name,
      id: attribute.id,
      entity: "Application" as const,
    })),
  ]
  const attributeLinked = field?.attributeLinked

  const FormAttributeLinkButton = useCallback(
    (attributeLink: FormAttributeLink) => {
      const { name, id } = attributeLink
      const isAlreadySelected = fields.some(
        (field) => field.attributeLinked?.id === id,
      )

      return (
        <Button
          key={id}
          variant="plain"
          isDisabled={isAlreadySelected}
          className="h-7 w-full rounded-none px-3 text-left leading-7 outline-none focus:bg-gray-50 focus:outline-none focus:ring-0"
          onPress={() => {
            if (isAlreadySelected) return

            updateField(fieldId, {
              attributeLinked: attributeLink,
            })
            setView("default")
          }}
        >
          {name}
        </Button>
      )
    },
    [fieldId, updateField, fields],
  )

  return (
    <DialogTrigger isOpen={opened} onOpenChange={onOpenChange}>
      <Button
        variant="plain"
        className="flex h-6 w-6 items-center justify-center"
      >
        <ThreeDotsHorizontal className="h-6 text-gray-500 text-sm" />
      </Button>
      <Popover placement="left top">
        <Dialog className="outline-none">
          {view === "default" ? (
            <motion.div
              layoutId="create-entity-menu"
              layout
              className="w-64 overflow-y-auto p-2 px-3"
            >
              <h2 className="mb-3 font-medium">Question options</h2>
              <div className="flex flex-col gap-y-2 text-gray-500">
                <div className="flex items-center">
                  <span className="flex-1">Required</span>
                  <span className="h-6 w-10">
                    <Switch
                      isSelected={!!field?.required}
                      onChange={(ev) => {
                        updateField(fieldId, { required: ev })
                      }}
                    />
                  </span>
                </div>
                {allowLinking ? (
                  <Button
                    variant={"plain"}
                    className={
                      "flex h-8 items-center justify-between text-left text-inherit "
                    }
                    onPress={() => setView("select-attribute")}
                  >
                    {attributeLinked ? (
                      <>
                        <Link className="-ml-0.5 mr-0.5" />
                        <div className="flex-1 overflow-hidden text-ellipsis">
                          {attributeLinked.name}
                        </div>
                      </>
                    ) : (
                      <span className="flex-1">Link an attribute</span>
                    )}
                    <CaretRight />
                  </Button>
                ) : null}
                {field?.attributeLinked ? null : (
                  <>
                    {field?.type === "select" ? (
                      <div className="flex items-center">
                        <span className="flex-1">Max selection</span>
                        <span className="h-6">
                          <select
                            onChange={(ev) => {
                              const value = ev.target.value
                              updateField(fieldId, {
                                maxSelection:
                                  value === "unlimited" ? value : Number(value),
                              })
                            }}
                            className="outline-none"
                          >
                            <option value="unlimited">Unlimited</option>
                            <option value="1">1</option>
                          </select>
                        </span>
                      </div>
                    ) : null}
                    {field?.type === "date" ? (
                      <>
                        <div className="flex items-center">
                          <span className="flex-1">Include time</span>
                          <span className="h-6 w-10">
                            <Switch
                              isSelected={!!field?.includeTime}
                              onChange={(ev) => {
                                updateField(fieldId, { includeTime: ev })
                              }}
                            />
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="flex-1">End date</span>
                          <span className="h-6 w-10">
                            <Switch
                              isSelected={!!field?.enableEndDate}
                              onChange={(ev) => {
                                updateField(fieldId, { enableEndDate: ev })
                              }}
                            />
                          </span>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
                <div className="border-gray-100 border-t" />
                <Button
                  variant="plain"
                  className="h-6 text-left text-inherit text-red-500 leading-6"
                  onPress={() => {
                    removeField(fieldId)
                    setOpened(false)
                  }}
                >
                  Delete question
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              // layoutId="create-entity-menu"
              // layout
              className="w-64 overflow-y-auto pt-2"
            >
              <Button
                variant="plain"
                className="mb-3 ml-2 inline-flex items-center text-gray-500 text-xs"
                onPress={() => setView("default")}
              >
                <CaretRight className="-rotate-180 mr-0.5 transform" />
                <span>Back</span>
              </Button>
              {linkCandidateAtttributeOptions.length ? (
                <>
                  <div className="mb-1 px-3 pt-1 text-gray-400 text-xs">
                    Candidate
                  </div>
                  {linkCandidateAtttributeOptions.map(FormAttributeLinkButton)}
                </>
              ) : null}
              {linkApplicationAttributeOptions.length ? (
                <>
                  <div className="mb-1 px-3 pt-1 text-gray-400 text-xs">
                    Application
                  </div>
                  {linkApplicationAttributeOptions.map(FormAttributeLinkButton)}
                </>
              ) : null}
              {attributeLinked ? (
                <Button
                  variant="plain"
                  className="mt-2 h-7 w-full border-gray-100 border-t px-3 text-left text-red-500 leading-7 outline-none focus:bg-gray-50 focus:outline-none focus:ring-0"
                  onPress={() => {
                    updateField(fieldId, { attributeLinked: undefined })
                    setView("default")
                  }}
                >
                  Unlink
                </Button>
              ) : null}
              {/* <ListBox
                key={"List of candidate attributes"}
                id="List of candidate attributes"
                aria-label="List of candidate attributes"
                shouldFocusWrap
                autoFocus
                className="flex flex-1 flex-col gap-y-3"
                items={candidatesAttributes}
              >
                {() => <span>Hello world</span>}

                {candidatesAttributes.map((attribute) => {
                  const { id, name } = attribute
                  return (
                    // <ListBoxItem
                    //   key={id}
                    //   className="flex h-7 items-center gap-x-2 rounded-md px-2 leading-8 outline-none hover:bg-slate-50 focus:bg-slate-50"
                    //   onAction={() => {}}
                    //   textValue={name}
                    // >

                    <span key={id}>{name}</span>
                  )
                })}
              </ListBox> */}
            </motion.div>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default FieldAction
