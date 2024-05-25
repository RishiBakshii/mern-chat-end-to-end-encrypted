import { useState } from "react"
import type { IUser } from "../../interfaces/auth"
import type { IMessage } from "../../interfaces/messages"
import { MessageCard } from "./MessageCard"
import { IChatWithUnreadMessages } from "../../interfaces/chat"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
  selectedChatDetails:IChatWithUnreadMessages
}
export const MessageList = ({messages,loggedInUserId,isGroupChat,selectedChatDetails}:PropTypes) => {

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>()
  const [editMessageId,setEditMessageId] = useState<string>()

  const handleSetOpenContextMenuMessageId=(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string)=>{
    e.stopPropagation()
    e.preventDefault()
    setOpenContextMenuMessageId(messageId)
  }


  return (
    <>
      {messages.map(message => (
        <MessageCard
          loggedInUserId={loggedInUserId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          setEditMessageId={setEditMessageId}
          editMessageId={editMessageId}
          onContextMenuOpen={handleSetOpenContextMenuMessageId}
          isContextMenuOpen={openContextMenuMessageId===message._id}
          isGroupChat={isGroupChat} 
          key={message._id} 
          message={message} 
          myMessage={loggedInUserId===message.sender._id} 
          selectedChatDetails={selectedChatDetails}
        />
      ))}
    </>
  )
}