import { ChatListSkeleton } from "./ChatListSkeleton"
import { SearchInputSkeleton } from "./SearchInputSkeleton"

export const ChatListWithSearchSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-5">
        <SearchInputSkeleton/>
        <ChatListSkeleton/>
    </div>
  )
}
