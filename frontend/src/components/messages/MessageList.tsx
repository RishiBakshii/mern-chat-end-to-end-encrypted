import { useState } from "react"
import type { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import type { IMessage } from "../../interfaces/messages"
import { MessageCard } from "./MessageCard"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
  selectedChatDetails:IChatWithUnreadMessages
  totalPages:number | undefined
  fetchMoreMessages: (_id: string, page: number) => void
  messageContainerRef: React.RefObject<HTMLDivElement>
}
export const MessageList = ({messages,loggedInUserId,isGroupChat,selectedChatDetails,messageContainerRef}:PropTypes) => {

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>()
  const [editMessageId,setEditMessageId] = useState<string>()

  const handleSetOpenContextMenuMessageId=(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string)=>{
    e.stopPropagation()
    e.preventDefault()
    setOpenContextMenuMessageId(messageId)
  }

  return (
    <div ref={messageContainerRef} className="flex h-full flex-col gap-y-4 max-xl:gap-y-2 overflow-y-scroll">

      {messages?.map((message,index) => (
        <MessageCard
          loggedInUserId={loggedInUserId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          setEditMessageId={setEditMessageId}
          editMessageId={editMessageId}
          onContextMenuOpen={handleSetOpenContextMenuMessageId}
          isContextMenuOpen={openContextMenuMessageId===message._id}
          isGroupChat={isGroupChat} 
          key={index} 
          message={message} 
          myMessage={loggedInUserId===message.sender._id} 
          selectedChatDetails={selectedChatDetails}
        />
      ))}

    </div>
  )
}