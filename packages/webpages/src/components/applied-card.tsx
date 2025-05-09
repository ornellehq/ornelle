import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type { GetOpening200Response1Application } from "sdks/src/server-sdk"
import Sent from "./icons/sent"

dayjs.extend(relativeTime)

interface Props {
  application: GetOpening200Response1Application
}

const AppliedCard = ({ application }: Props) => {
  return (
    <div className="rounded-xl bg-gray-100 p-4 text-sm">
      <div className="flex items-center gap-x-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
          <Sent className="w-4" />
        </span>
        <div className="flex-1">
          <div>You applied</div>
          <div className="text-gray-500 text-xs">
            {dayjs(application.createdAt).fromNow()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppliedCard
