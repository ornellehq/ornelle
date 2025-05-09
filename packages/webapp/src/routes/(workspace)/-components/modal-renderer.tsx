import { useNavigate } from "@tanstack/react-router"
import { type PropsWithChildren, useCallback } from "react"

import modals from "./modals"
import ModalComponent from "./modals/helpers/modal"
import type { ModalParams } from "./modals/util"

interface Props {
  modal: ModalParams
  close?(): void
  componentProps?: object
}

const ModalRenderer = ({
  componentProps,
  ...props
}: Props | Omit<PropsWithChildren<Props & { title: string }>, "modal">) => {
  const navigate = useNavigate()
  const close =
    props.close ??
    (() => {
      navigate({ to: "" })
    })

  // @ts-ignore
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const CustomComponent = useCallback(() => props.children, [])
  const { title, Component } =
    "modal" in props
      ? typeof modals[props.modal.id] === "function"
        ? modals[props.modal.id]({ modal: props.modal })
        : modals[props.modal.id]
      : { title: props.title, Component: CustomComponent }

  return <ModalComponent title={title} Component={Component} close={close} />
}

export default ModalRenderer
