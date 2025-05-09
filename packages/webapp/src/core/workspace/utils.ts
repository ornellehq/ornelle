import QueryString from "qs"
import {
  ActivityApi,
  ApplicationApi,
  ApplicationStatusApi,
  AttributeApi,
  AttributeValueApi,
  CandidateApi,
  Configuration,
  EmailTemplateApi,
  FormApi,
  ListingThemeApi,
  MessageApi,
  OpeningApi,
  ProfileApi,
  ReviewApi,
  RoleApi,
  SavedApi,
  SavedFolderApi,
  UserApi,
  ViewApi,
  WorkspaceApi,
} from "sdks/src/server-sdk"

export const getWorkspaceInfo = async ({
  code,
  api,
}: { code: string; api: WorkspaceApi }) => {
  const {
    data: { token },
    meta: { workspace },
  } = await api.getWorkspaceAuthToken({ url: code })

  const apiConfigurationWithAuth = new Configuration({
    basePath: import.meta.env.VITE_MAIN_SERVER,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    queryParamsStringify: QueryString.stringify,
  })

  return {
    workspace: {
      ...workspace,
      code: workspace.url,
    },
    api: {
      role: new RoleApi(apiConfigurationWithAuth),
      workspace: new WorkspaceApi(apiConfigurationWithAuth),
      opening: new OpeningApi(apiConfigurationWithAuth),
      user: new UserApi(apiConfigurationWithAuth),
      candidate: new CandidateApi(apiConfigurationWithAuth),
      attribute: new AttributeApi(apiConfigurationWithAuth),
      attributeValue: new AttributeValueApi(apiConfigurationWithAuth),
      form: new FormApi(apiConfigurationWithAuth),
      application: new ApplicationApi(apiConfigurationWithAuth),
      emailTemplate: new EmailTemplateApi(apiConfigurationWithAuth),
      profile: new ProfileApi(apiConfigurationWithAuth),
      activity: new ActivityApi(apiConfigurationWithAuth),
      view: new ViewApi(apiConfigurationWithAuth),
      listingTheme: new ListingThemeApi(apiConfigurationWithAuth),
      review: new ReviewApi(apiConfigurationWithAuth),
      applicationStatus: new ApplicationStatusApi(apiConfigurationWithAuth),
      saved: new SavedApi(apiConfigurationWithAuth),
      savedFolder: new SavedFolderApi(apiConfigurationWithAuth),
      message: new MessageApi(apiConfigurationWithAuth),
    },
  }
}
