import { memo } from "react"
import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { ChatCard } from "./ChatCard"

type PropTypes = {
  chats:Array<IChatWithUnreadMessages>
  loggedInUserId:string
  selectedChatDetails:IChatWithUnreadMessages | undefined | null
  updateSelectedChatId:(chatId: string) => void
  toggleChatBar:()=>void
  getChatName: (selectedChatDetails: IChatWithUnreadMessages | null, loggedInUserId: string | null | undefined) => string | undefined
  getChatAvatar: (selectedChatDetails: IChatWithUnreadMessages | null, loggedInUserId: string | null | undefined) => string | undefined
}
export const ChatList = memo(({chats,loggedInUserId,selectedChatDetails,updateSelectedChatId,toggleChatBar,getChatAvatar,getChatName}:PropTypes) => {

  const isMd = useMediaQuery(768)

  return (
    <>
    <div className="flex flex-col gap-y-4">
        {
          
          [...chats].sort((a, b) => {
            // Primary sort by unread message count in descending order
            if (b.unreadMessages.count !== a.unreadMessages.count) {
              return b.unreadMessages.count - a.unreadMessages.count;
            } else {
              // Secondary sort by latest message timestamp in descending order
              const aTime = new Date(a.latestMessage?.createdAt || a.createdAt).getTime();
              const bTime = new Date(b.latestMessage?.createdAt || b.createdAt).getTime();
              return bTime - aTime;
            }
          })
          .map(chat=>(

            <ChatCard
              key={chat._id}
              loggedInUserId={loggedInUserId}
              isGroupChat={chat.isGroupChat}
              members={chat.members}
              latestMessage={chat.latestMessage}
              createdAt={chat.createdAt}
              isMd={isMd}
              selectedChatDetails={selectedChatDetails}
              isTyping={chat.userTyping?.length>0}
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
