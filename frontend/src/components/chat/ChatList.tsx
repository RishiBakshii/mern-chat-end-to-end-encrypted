import { memo } from "react"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { ChatCard } from "./ChatCard"

type PropTypes = {
  chats:Array<IChatWithUnreadMessages>
  loggedInUserId:string
  updateSelectedChatId:(chatId: string) => void
  toggleChatBar:()=>void
  getChatName: (selectedChatDetails: IChatWithUnreadMessages | null, loggedInUserId: string | null | undefined) => string | undefined
  getChatAvatar: (selectedChatDetails: IChatWithUnreadMessages | null, loggedInUserId: string | null | undefined) => string | undefined
}
export const ChatList = memo(({chats,loggedInUserId,updateSelectedChatId,toggleChatBar,getChatAvatar,getChatName}:PropTypes) => {

  return (
    <>
    <div className="flex flex-col gap-y-4">
        {
          chats.map(chat=>(

            <ChatCard
              isTyping={chat.userTyping.length>0}
              chatId={chat._id}
              chatName={getChatName(chat,loggedInUserId)!}
              avatar={getChatAvatar(chat,loggedInUserId)!}
              unreadMessage={chat.unreadMessages}
              updateSelectedChatId={updateSelectedChatId}
              toggleChatBar={toggleChatBar}
            />

          ))
        }
    </div>
    </>

  )
})
