import { useQuery } from "@tanstack/react-query"
import type { EntityType } from "isomorphic-blocs/src/prisma"
import { type ReactNode, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "webui-library/src/button"
import { Switch } from "webui-library/src/switch"
import { useWorkspaceApi } from "~/core/workspace/api"
import type { AttributeValueUpsertFn } from "~/core/workspace/entities/types"
import DefinitionEditor from "./definition-editor"
import attributeEditors from "./editors"
import type { AttributeRenderDefinition } from "./types"
import AttributeValueEditor, {
  AttributeValueEditorWithFocus,
} from "./value-editor"

export interface EntityFieldsProps {
  form: UseFormReturn<Record<string, ReactNode>>
  attributes: AttributeRenderDefinition[]
  onValueUpdate?: AttributeValueUpsertFn
  entityType: EntityType
}

const EntityField = ({
  attribute,
  form,
  onValueUpdate,
  entityType,
}: {
  attribute: AttributeRenderDefinition
} & Pick<EntityFieldsProps, "form" | "onValueUpdate" | "entityType">) => {
  const api = useWorkspaceApi()
  const { data: profiles = [] } = useQuery({
    queryKey: [api.profile.getProfiles.name],
    queryFn: () => api.profile.getProfiles(),
  })
  const [{ editing, activeElement }, setEditing] = useState<{
    editing: boolean
    activeElement?: HTMLElement
  }>({ editing: false })
  const id = attribute.id
  const Editor = attributeEditors[attribute.dataType] ?? (() => <></>)
  const formValue = form.watch(id)
  const value = attribute.transform ? attribute.transform(formValue) : formValue
  const EditorRenderer =
    attribute.dataType === "Date"
      ? AttributeValueEditor
      : AttributeValueEditorWithFocus
  const saveValue = (value: ReactNode) => {
    setEditing({ editing: false })
    if (value === undefined) return

    const previousValue = form.getValues()[id]

    if (JSON.stringify({ value }) === JSON.stringify({ value: previousValue }))
      return

    form.setValue(id, value)
    try {
      onValueUpdate?.({
        value,
        attributeId: attribute.id,
        configuration:
          attribute.type === "custom" ? attribute._configuration : {},
        dataType: attribute.dataType,
        entityId: attribute.type === "custom" ? attribute.entityId : "",
      })
    } catch (err) {
      form.setValue(id, previousValue)
    }
  }
  const editor = (
    <EditorRenderer
      type={attribute.type}
      field={attribute.field}
      entity={entityType}
      value={form.getValues(id) ?? null}
      Editor={Editor}
      close={saveValue}
      configuration={
        attribute.type === "custom" ? attribute._configuration : null
      }
      activeElement={activeElement}
      attributeId={attribute.id}
    />
  )

  return (
    <div className="flex ">
      <div className="min-h-9 w-40 leading-9">
        <DefinitionEditor
          name={attribute.name}
          attributeId={attribute.id}
          entityType={entityType}
          isEditable={attribute.editable && attribute.type !== "system"}
        >
          {attribute.name}
        </DefinitionEditor>
      </div>
      <div className="relative flex-1 overflow-hidden text-black">
        {attribute.type === "custom" &&
        attribute.dataType === "Toggle" &&
        attribute._configuration?.style === "Switch" ? (
          <Switch
            className="mx-1.5"
            isSelected={value === "Yes"}
            onChange={(val) => saveValue(val ? "Yes" : "No")}
          />
        ) : !attribute.plain ? (
          <Button
            variant="plain"
            className={`block min-h-9 w-full rounded px-2 text-left leading-9 hover:bg-gray-50 ${value ? "" : "text-gray-300"}`}
            onPress={() => {
              if (attribute.editable)
                setEditing({
                  editing: !!Editor,
                  activeElement:
                    (document.activeElement as HTMLElement) ?? undefined,
                })
            }}
          >
            {value || "Empty"}
          </Button>
        ) : (
          <div className="block min-h-9 w-full rounded px-2 text-left leading-9">
            {value || "Empty"}
          </div>
        )}
        {editing && attribute.editable ? editor : null}
      </div>
    </div>
  )
}

const EntityFields = ({
  form,
  attributes,
  onValueUpdate,
  entityType,
}: EntityFieldsProps) => {
  return (
    <>
      {attributes.map((attribute) => {
        return (
          <EntityField
            entityType={entityType}
            key={attribute.id}
            attribute={attribute}
            form={form}
            {...(onValueUpdate ? { onValueUpdate } : {})}
          />
        )
      })}
    </>
  )
}

export default EntityFields
