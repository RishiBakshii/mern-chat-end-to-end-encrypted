import { memo } from "react"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { ChatCard } from "./ChatCard"

type PropTypes = {
  chats:Array<IChatWithUnreadMessages>
}
export const ChatList = memo(({chats}:PropTypes) => {

  return (
    <>
    <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth">
        {
          chats.map(chat=>
            <ChatCard chat={chat}/>
          )
        }
    </div>
    </>

  )
})
