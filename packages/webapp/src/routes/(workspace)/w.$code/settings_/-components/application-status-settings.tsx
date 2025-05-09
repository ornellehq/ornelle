import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Heading, Label } from "react-aria-components"
import { Controller, useForm } from "react-hook-form"
import type {
  CreateApplicationStatusRequestCategoryEnum,
  GetApplicationStatuses200ResponseInner,
  UpdateApplicationStatusRequestCategoryEnum,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import Dialog from "webui-library/src/dialog"
import DialogTrigger from "webui-library/src/dialog-trigger"
import { Form } from "webui-library/src/form"
import Add from "webui-library/src/icons/Add"
import Settings05 from "webui-library/src/icons/settings-05"
import Swatch from "webui-library/src/icons/swatch"
import Trash from "webui-library/src/icons/trash"
import Modal from "webui-library/src/modal"
import ModalOverlay from "webui-library/src/modal-overlay"
import { TextFieldInput } from "webui-library/src/text-field-input"
import Dropdown from "webui-library/src/widgets/dropdown"
import * as z from "zod"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"

// Default status colors - same ones used by Linear
const STATUS_COLORS = [
  "#F2994A", // Orange
  "#F53E3E", // Red
  "#4DA1FF", // Blue
  "#5B6CD9", // Indigo
  "#9747FF", // Purple
  "#FF7DAA", // Pink
  "#00B341", // Green
  "#00C2E0", // Cyan
  "#E2B344", // Yellow
]

interface ApplicationStatus extends GetApplicationStatuses200ResponseInner {}

// Status form schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Status name is required" }),
  category: z.enum(["NotStarted", "Started", "Completed", "Rejected"], {
    required_error: "Please select a category",
  }),
  color: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface StatusEditDialogProps {
  status?: ApplicationStatus
  onClose: () => void
  open: boolean
}

// Dialog for editing or creating a status
const StatusEditDialog = ({ status, onClose, open }: StatusEditDialogProps) => {
  const api = useWorkspaceApi()
  const isNew = !status

  const form = useForm<FormValues>({
    defaultValues: {
      name: status?.name || "",
      category: status?.category || "NotStarted",
      color:
        status?.color ||
        STATUS_COLORS[Math.floor(Math.random() * STATUS_COLORS.length)],
    },
  })

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => {
      return api.applicationStatus.createApplicationStatus({
        createApplicationStatusRequest: {
          name: values.name,
          category:
            values.category as CreateApplicationStatusRequestCategoryEnum,
          ...(values.color && { color: values.color }),
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplicationStatuses"] })
      // Instead of toast, we'll just close the dialog
      onClose()
    },
    onError: (error) => {
      // Handle error without toast
      console.error(`Error creating status: ${error.message}`)
      // Could display error message in the form if needed
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!status) throw new Error("Status is required for update")
      return api.applicationStatus.updateApplicationStatus({
        id: status.id,
        updateApplicationStatusRequest: {
          name: values.name,
          category:
            values.category as UpdateApplicationStatusRequestCategoryEnum,
          color: values.color || undefined,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplicationStatuses"] })
      // Instead of toast, we'll just close the dialog
      onClose()
    },
    onError: (error) => {
      // Handle error without toast
      console.error(`Error updating status: ${error.message}`)
      // Could display error message in the form if needed
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (isNew) {
      createMutation.mutate(values)
    } else {
      updateMutation.mutate(values)
    }
  })

  return (
    <DialogTrigger isOpen={open}>
      <Modal>
        <ModalOverlay className="data-[entering]:fade-in-0 data-[exiting]:fade-out-0 fixed inset-0 bg-black/25 backdrop-grayscale data-[entering]:animate-in data-[exiting]:animate-out">
          <div className="data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg bg-white p-6 shadow-lg data-[entering]:animate-in data-[exiting]:animate-out">
            <Dialog>
              <div className="mb-5">
                <Heading slot="title" className="font-medium text-lg">
                  {isNew ? "Create New Status" : "Edit Status"}
                </Heading>
              </div>
              <Form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Name</Label>
                    <TextFieldInput
                      autoFocus
                      {...form.register("name", { required: true })}
                      placeholder="Status name"
                    />
                    {form.formState.errors.name && (
                      <div className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Category</Label>
                    <Dropdown
                      // defaultSelectedKey={form.getValues("category")}
                      button={{
                        children: form.getValues("category"),
                      }}
                      onSelectionChange={(selection) => {
                        const value = selection as
                          | "NotStarted"
                          | "Started"
                          | "Completed"
                          | "Rejected"
                        form.setValue("category", value)
                      }}
                      items={[
                        { id: "NotStarted", children: "Not Started" },
                        { id: "Started", children: "Started" },
                        { id: "Completed", children: "Completed" },
                        { id: "Rejected", children: "Rejected" },
                      ]}
                      // selectedKey={form.watch("category")}
                      // isDisabled={!isNew && status?.isOutOfTheBox}
                      // popover={{
                      //   className: "w-72 h-96",
                      // }}
                    />
                    {form.formState.errors.category && (
                      <div className="text-red-500 text-sm">
                        {form.formState.errors.category.message}
                      </div>
                    )}
                  </div>

                  <Controller
                    control={form.control}
                    name="color"
                    render={({ field }) => {
                      return (
                        <div className="space-y-2">
                          <Label className="font-medium text-sm">Color</Label>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_COLORS.map((color) => (
                              <Button
                                type="button"
                                key={color}
                                className={`h-8 w-8 cursor-pointer rounded-full ring-2 ring-offset-2 ${
                                  field.value === color
                                    ? "ring-blue-300"
                                    : "ring-transparent"
                                }`}
                                style={{ backgroundColor: color }}
                                onPress={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    }}
                  />

                  <div className="mt-5 flex justify-end space-x-2">
                    <Button variant="plain" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      className="px-2"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : isNew
                          ? "Create"
                          : "Update"}
                    </Button>
                  </div>
                </div>
              </Form>
            </Dialog>
          </div>
        </ModalOverlay>
      </Modal>
    </DialogTrigger>
  )
}

interface StatusCategoryGroupProps {
  title: string
  statuses: ApplicationStatus[]
  onEdit: (status: ApplicationStatus) => void
  onDelete: (status: ApplicationStatus) => void
}

// Component for grouping statuses by category
const StatusCategoryGroup = ({
  title,
  statuses,
  onEdit,
  onDelete,
}: StatusCategoryGroupProps) => {
  return (
    <div className="mb-8">
      <h3 className="mb-4 font-medium text-lg">{title}</h3>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between rounded-md border border-gray-200 p-3"
          >
            <div className="flex items-center space-x-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: status.color || "#CCCCCC" }}
              />
              <span>{status.name}</span>
              {status.isOutOfTheBox ? (
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs">
                  Built-in
                </span>
              ) : null}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="plain" size="sm" onPress={() => onEdit(status)}>
                <Settings05 className="h-4 w-4" />
              </Button>
              <Button
                variant="plain"
                size="sm"
                onPress={() => onDelete(status)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Confirmation dialog component
const DeleteConfirmationDialog = ({
  status,
  open,
  onClose,
  onConfirm,
  isDeleting,
}: {
  status?: ApplicationStatus
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}) => {
  return (
    <DialogTrigger isOpen={open}>
      <Modal>
        <ModalOverlay className="data-[entering]:fade-in-0 data-[exiting]:fade-out-0 fixed inset-0 z-50 bg-black/25 backdrop-blur-sm data-[entering]:animate-in data-[exiting]:animate-out">
          <div className="data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg bg-white p-6 shadow-lg data-[entering]:animate-in data-[exiting]:animate-out">
            <Dialog>
              <div className="mb-5">
                <Heading slot="title" className="font-medium text-lg">
                  Delete Status
                </Heading>
              </div>
              <p className="mb-6">
                Are you sure you want to delete the status "{status?.name}"?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="plain" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={onConfirm}
                  isDisabled={isDeleting}
                  className="bg-red-500"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </Dialog>
          </div>
        </ModalOverlay>
      </Modal>
    </DialogTrigger>
  )
}

// Main application status settings component
export const ApplicationStatusSettings = () => {
  const [editingStatus, setEditingStatus] = useState<
    ApplicationStatus | undefined
  >(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deletingStatus, setDeletingStatus] = useState<
    ApplicationStatus | undefined
  >(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const api = useWorkspaceApi()

  // Fetch application statuses
  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ["getApplicationStatuses"],
    queryFn: () => api.applicationStatus.getApplicationStatuses(),
  })

  // Group statuses by category
  const notStartedStatuses = statuses.filter(
    (status) => status.category === "NotStarted",
  )
  const startedStatuses = statuses.filter(
    (status) => status.category === "Started",
  )
  const completedStatuses = statuses.filter(
    (status) => status.category === "Completed",
  )
  const rejectedStatuses = statuses.filter(
    (status) => status.category === "Rejected",
  )

  const handleEdit = (status: ApplicationStatus) => {
    setEditingStatus(status)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingStatus(undefined)
    setIsDialogOpen(true)
  }

  const handleDelete = (status: ApplicationStatus) => {
    setDeletingStatus(status)
    setIsDeleteDialogOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: (statusId: string) => {
      return api.applicationStatus.deleteApplicationStatus({ id: statusId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplicationStatuses"] })
      setIsDeleteDialogOpen(false)
      setDeletingStatus(undefined)
    },
    onError: (error) => {
      console.error(`Error deleting status: ${error.message}`)
      // Could display error message if needed
    },
  })

  const confirmDelete = () => {
    if (deletingStatus) {
      deleteMutation.mutate(deletingStatus.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        Loading application statuses...
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Application Statuses</h2>
          <p className="text-gray-500">
            Manage the statuses that applications can have throughout the hiring
            process.
          </p>
        </div>
        <Button onPress={handleCreate} className="flex items-center px-2">
          <Add className="mr-2 h-4 w-4" />
          New Status
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center space-x-3">
          <Swatch className="h-5 w-5 text-amber-500" />
          <p className="text-sm">
            Application statuses are grouped into three categories: Not Started,
            Started, and Completed. Each status belongs to one of these
            categories to help organize your hiring workflow.
          </p>
        </div>
      </div>

      <StatusCategoryGroup
        title="Not Started"
        statuses={notStartedStatuses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StatusCategoryGroup
        title="Started"
        statuses={startedStatuses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StatusCategoryGroup
        title="Completed"
        statuses={completedStatuses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StatusCategoryGroup
        title="Rejected"
        statuses={rejectedStatuses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit/Create Dialog */}
      {isDialogOpen && (
        <StatusEditDialog
          status={editingStatus}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingStatus(undefined)
          }}
          open={isDialogOpen}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        status={deletingStatus}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
