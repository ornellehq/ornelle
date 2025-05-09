import type { Editor } from "@tiptap/react"
import { forwardRef } from "react"
import type { GetEmailTemplates200ResponseInnerTypeEnum } from "sdks/src/server-sdk"
import RTE from "webui-library/src/widgets/rte"
import { useEmailTemplateVariables } from "~/core/workspace/email-template/hooks"
import { useConfiguredVariableTiptapExtension } from "~/core/workspace/tiptap/variable-extension"

interface EmailTemplatesRTEProps extends React.ComponentProps<typeof RTE> {
  emailType: GetEmailTemplates200ResponseInnerTypeEnum
}

const EmailTemplatesRTE = forwardRef<Editor, EmailTemplatesRTEProps>(
  ({ emailType, ...props }, ref) => {
    const { blocks, status } = useEmailTemplateVariables({ emailType })
    const VariableExtension = useConfiguredVariableTiptapExtension({ blocks })

    return status === "pending" ? (
      <div>Loading...</div>
    ) : (
      <RTE extensions={[VariableExtension]} {...props} ref={ref} />
    )
  },
)

export default EmailTemplatesRTE
