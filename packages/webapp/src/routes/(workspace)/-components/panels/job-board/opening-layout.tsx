import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import {
  type GetAttributes200ResponseInner,
  GetAttributes200ResponseInnerEntityTypeEnum,
  GetAttributesEntityTypesEnum,
  type GetListingThemes200ResponseInner,
} from "sdks/src/server-sdk"
import { Button } from "webui-library/src/button"
import { Form } from "webui-library/src/form"
import Loading01 from "webui-library/src/icons/loading-01"
import RTE from "webui-library/src/widgets/rte"
import { queryClient } from "~/core/network"
import { useWorkspaceApi } from "~/core/workspace/api"
import { useEntityAttributes } from "~/core/workspace/entities/hooks"
import { useConfiguredOpeningVariableTiptapExtension } from "~/core/workspace/openings/hooks"
import FooterContainer from "../../modals/helpers/footer-container"

interface FieldValues {
  content: {
    html: string
    json: object
  }
}

const JobBoardOpeningLayoutWithData = ({
  listingTheme,
  attributes,
}: {
  listingTheme: GetListingThemes200ResponseInner
  attributes: GetAttributes200ResponseInner[]
}) => {
  const api = useWorkspaceApi()
  const navigate = useNavigate()

  const roleAttributes = attributes.filter(
    ({ entityType }) =>
      entityType === GetAttributes200ResponseInnerEntityTypeEnum.Role,
  )
  const openingAttributes = attributes.filter(
    ({ entityType }) =>
      entityType === GetAttributes200ResponseInnerEntityTypeEnum.Opening,
  )
  const form = useForm<FieldValues>({
    defaultValues: {
      content: listingTheme.openingConfig?.content ?? { html: "", json: {} },
    },
  })
  const onSubmit = form.handleSubmit(async (values) => {
    await api.listingTheme.upsertListingTheme({
      id: "default",
      upsertListingThemeRequest: {
        name: "Default",
        openingConfig: {
          ...(listingTheme.openingConfig ?? {}),
          content: values.content,
        },
        openingsConfig: listingTheme.openingsConfig ?? {
          content: { html: "", json: {} },
        },
      },
    })
    queryClient.invalidateQueries({
      queryKey: [api.listingTheme.getListingTheme.name, "default"],
    })
    navigate({ to: "" })
  })
  const VariableTiptapExtension = useConfiguredOpeningVariableTiptapExtension({
    openingAttributes,
    roleAttributes,
  })
  // const SlashCommandExtension = useSlashCommandExtension({
  //   blocks: [
  //     {
  //       id: "records",
  //       name: "Records",
  //       blocks: [
  //         {
  //           id: "opening-description",
  //           name: "Opening Description",
  //           onPress: ({ editor, range }) => {
  //             editor
  //               .chain()
  //               .focus()
  //               .deleteRange(range)
  //               .createParagraphNear()
  //               .insertContent({
  //                 type: "record-content",
  //                 attrs: {
  //                   recordType: GetAttributesEntityTypesEnum.Opening,
  //                 },
  //               })
  //               .createParagraphNear()
  //               .run()
  //             return editor.view.dispatch(editor.view.state.tr)
  //           },
  //         },
  //         {
  //           id: "role-description",
  //           name: "Role Description",
  //           onPress: ({ editor, range }) => {
  //             editor
  //               .chain()
  //               .focus()
  //               .deleteRange(range)
  //               .createParagraphNear()
  //               .insertContent({
  //                 type: "record-content",
  //                 attrs: {
  //                   recordType: GetAttributesEntityTypesEnum.Role,
  //                 },
  //               })
  //               .createParagraphNear()
  //               .run()
  //             return editor.view.dispatch(editor.view.state.tr)
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // })

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
                  VariableTiptapExtension,
                  // RecordContentExtension.configure({}),
                  // SlashCommandExtension,
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

const JobBoardOpeningLayout = () => {
  const api = useWorkspaceApi()
  const { data } = useQuery({
    queryKey: [api.listingTheme.getListingTheme.name, "default"],
    queryFn: async () => api.listingTheme.getListingTheme({ id: "default" }),
  })
  const { data: attributes, status: attributesStatus } = useEntityAttributes([
    GetAttributesEntityTypesEnum.Opening,
    GetAttributesEntityTypesEnum.Role,
  ])

  return data && attributesStatus === "success" ? (
    <JobBoardOpeningLayoutWithData
      listingTheme={data}
      attributes={attributes}
    />
  ) : (
    <div className="flex w-[48rem] flex-1 items-center justify-center">
      <Loading01 className="animate-spin" />
    </div>
  )
}

export default JobBoardOpeningLayout

/**
 * Role description
 * Opening description
 *
 */
