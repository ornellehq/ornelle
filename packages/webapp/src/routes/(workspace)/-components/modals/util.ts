import { z } from "zod"

export const modalSchema = z.object({
  id: z.enum(["cr8et", "cr8nt"] as const),
})

export const modalWithIdSchema = z.object({})

export type ModalParams =
  | z.infer<typeof modalSchema>
  | z.infer<typeof modalWithIdSchema>
