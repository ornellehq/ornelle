import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import type { GetListingThemes200ResponseInner } from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import Loading01 from "webui-library/src/icons/loading-01"
import RTE from "webui-library/src/widgets/rte"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import OpeningsExtension from "~/core/workspace/tiptap/openings-extension"
import { jobBoardContentBlockGroups } from "~/lib/tiptap/data"
import { useSlashCommandExtension } from "~/lib/tiptap/slash-extension"
import FooterContainer from "../../modals/helpers/footer-container"

interface FieldValues {
  content: {
    html: string
    json: object
  }
}

const JobBoardLandingLayoutWithData = ({
  listingTheme,
}: { listingTheme: GetListingThemes200ResponseInner }) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()
  const form = useForm<FieldValues>({
    defaultValues: {
      content: listingTheme.openingsConfig?.content ?? { html: "", json: {} },
    },
  })
  const SlashCommandExtension = useSlashCommandExtension({
    blocks: jobBoardContentBlockGroups,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await api.listingTheme.upsertListingTheme({
      id: "default",
      upsertListingThemeRequest: {
        name: "Default",
        openingConfig: listingTheme.openingConfig ?? {
          content: { html: "", json: {} },
        },
        openingsConfig: {
          ...(listingTheme.openingsConfig ?? {}),
          content: values.content,
        },
      },
    })
    queryClient.invalidateQueries({
      queryKey: [api.listingTheme.getListingTheme.name, "default"],
    })
    navigate({ to: "" })
  })

  return (
    <Form
      className="flex w-[48rem] flex-1 flex-col overflow-y-auto"
      onSubmit={onSubmit}
    >
      <div className="flex-1 overflow-y-auto p-5">
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <RTE
                defaultContent={field.value.html ?? ""}
                autofocus
                onChange={(data) => {
                  field.onChange(data)
                }}
                editorProps={{
                  attributes: {
                    class: "max-w-xl mx-auto",
                  },
                }}
                extensions={[
                  OpeningsExtension.configure({}),
                  SlashCommandExtension,
                ]}
              />
            )
          }}
        />
      </div>
      <FooterContainer>
        <Button
          variant="elevated"
          type="submit"
          className="px-2 [--spacing-9:1.5rem]"
        >
          Save
        </Button>
      </FooterContainer>
    </Form>
  )
}

const JobBoardLandingLayout = () => {
  const api = useWorkspaceApi()
  const { data } = useQuery({
    queryKey: [api.listingTheme.getListingTheme.name, "default"],
    queryFn: async () => api.listingTheme.getListingTheme({ id: "default" }),
  })

  return data ? (
    <JobBoardLandingLayoutWithData listingTheme={data} />
  ) : (
    <div className="flex w-[48rem] flex-1 items-center justify-center">
      <Loading01 className="animate-spin" />
    </div>
  )
}

export default JobBoardLandingLayout

/**
 * Add openings list, aside support, image
 * Insert, text customization
 */
