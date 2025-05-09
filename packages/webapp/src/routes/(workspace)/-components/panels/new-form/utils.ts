import type { FormField } from "isomorphic-blocs/src/types/form"
import { createContext, useContext } from "react"
import Calendar from "webui-library/src/icons/Calendar"
import CaretDown from "webui-library/src/icons/CaretDown"
import FolderFile from "webui-library/src/icons/FolderFile"
import Link from "webui-library/src/icons/Link"
import MailAt from "webui-library/src/icons/MailAt"
import NumberSign from "webui-library/src/icons/NumberSign"
import SmartPhone from "webui-library/src/icons/SmartPhone"
import Text from "webui-library/src/icons/Text"
import Toggle from "webui-library/src/icons/toggle"
import type { Icon } from "webui-library/src/types"

export interface INewFormContextValue {
  fields: FormField[]
  addField(field: FormField): void
  removeField(fieldId: string): void
  updateField(fieldId: string, field: Partial<Exclude<FormField, "id">>): void
}
export const NewFormContext = createContext<INewFormContextValue>({
  fields: [],
  addField() {},
  removeField() {},
  updateField() {},
})

export const useNewFormContext = () => useContext(NewFormContext)

export const fieldTypeIconMap: Record<FormField["type"], Icon> = {
  text: Text,
  select: CaretDown,
  date: Calendar,
  email: MailAt,
  file: FolderFile,
  url: Link,
  phone: SmartPhone,
  number: NumberSign,
  toggle: Toggle,
}

export interface FormFieldValues {
  title: string
  fields: FormField[]
  openings: string[]
}
