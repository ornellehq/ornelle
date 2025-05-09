import type { ClassNameValue } from "tailwind-merge"
import { twMerge } from "tailwind-merge"

export const cn = (...classNames: ClassNameValue[]) => twMerge(...classNames)
