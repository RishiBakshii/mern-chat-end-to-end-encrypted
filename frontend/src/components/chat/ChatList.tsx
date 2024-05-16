import { memo } from "react"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { ChatCard } from "./ChatCard"
import { useGetChatName } from "../../hooks/useUtils/useGetChatName"
import { useGetChatAvatar } from "../../hooks/useUtils/useGetChatAvatar"

type PropTypes = {
  chats:Array<IChatWithUnreadMessages>
  updateSelectedChatId:(chatId: string) => void
}
export const ChatList = memo(({chats,updateSelectedChatId}:PropTypes) => {

  return (
    <>
    <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth">
        {
          chats.map(chat=>(

            <ChatCard
              isTyping={chat.userTyping.length>0}
              chatId={chat._id}
              chatName={useGetChatName(chat)!}
              avatar={useGetChatAvatar(chat)!}
              unreadMessageCount={chat.unreadMessages.count}
              latestUnreadMessage={chat.unreadMessages?.message?.content}
              updateSelectedChatId={updateSelectedChatId}
            />

          ))
        }
    </div>
    </>

  )
})
