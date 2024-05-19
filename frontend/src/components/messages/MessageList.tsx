import { useState } from "react"
import type { IUser } from "../../interfaces/auth"
import type { IMessage } from "../../interfaces/messages"
import { MessageCard } from "./MessageCard"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
}
export const MessageList = ({messages,loggedInUserId,isGroupChat}:PropTypes) => {

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>("")
  const [editMessageId,setEditMessageId] = useState<string>("")

  const handleContextMenuOpen=(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string)=>{
    e.stopPropagation()
    e.preventDefault()
    setOpenContextMenuMessageId(messageId)
  }


  return (
    <>
      {messages.map(message => (
        <MessageCard
          isEdited={message?.isEdited}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          setEditMessageId={setEditMessageId}
          editMessageId={editMessageId}
          onContextMenuOpen={handleContextMenuOpen}
          isContextMenuOpen={openContextMenuMessageId===message._id}
          isAttachment={message.attachments?.length>0}
          attachments={message.attachments}
          url={message.url}
          isTextMessage={!message?.url?.length}
          isGroupChat={isGroupChat} 
          key={message._id} 
          message={message} 
          myMessage={loggedInUserId===message.sender._id} 
        />
      ))}
    </>
  )
}