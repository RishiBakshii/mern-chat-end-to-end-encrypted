import { memo } from "react"
import { IChatWithUnreadMessages } from "../../../interfaces/chat"
import { ChatItem } from "./ChatItem"

type PropTypes = {
  chats:Array<IChatWithUnreadMessages>
}
export const ChatList = memo(({chats}:PropTypes) => {

  return (
    <>
    <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth scrollbar-w-[10rem]">
        {
          chats.map(chat=>
            <ChatItem chat={chat}/>
          )
        }
    </div>
    </>

  )
})
