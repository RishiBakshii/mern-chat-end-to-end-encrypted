import { useEffect, useState } from "react"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessage } from "../../interfaces/messages"
import { Gif } from "../ui/Gif"
import { AttachmentList } from "./AttachmentList"
import { Message } from "./Message"
import { PollCardForm } from "./PollCardForm"
import { useGetSharedKey } from "../../hooks/useAuth/useGetSharedKey"

type PropTypes = {
    isGroupChat:boolean
    myMessage:boolean
    message:IMessage
    loggedInUserId:string
    selectedChatDetails:IChatWithUnreadMessages
    editMessageId:string | undefined,
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const RenderAppropriateMessage = ({isGroupChat,myMessage,selectedChatDetails,loggedInUserId,message,editMessageId,setEditMessageId,setOpenContextMenuMessageId}:PropTypes) => {
  
  const getSharedKey = useGetSharedKey()
  const otherMember = selectedChatDetails.members.filter(member=>member._id!==loggedInUserId)[0]
  const [sharedKey, setSharedKey] = useState<CryptoKey>()

  const handleSetSharedKey = async()=>{
    const key = await getSharedKey(loggedInUserId,otherMember)
    key?setSharedKey(key):null
  }

  useEffect(()=>{
    handleSetSharedKey()
  },[])

  return (
    <>
    {
        isGroupChat && !myMessage &&
        <p className="text-primary-dark font-medium">{message.sender.username}</p>
    }
    
    {
        message.isPoll && message.pollQuestion &&
        <PollCardForm
           isMutipleAnswers={message?.isMultipleAnswers?true:false}
           messageId={message._id}
           question={message.pollQuestion}
           options={message.pollOptions}
        />
    }

    {
        message.attachments &&
        <AttachmentList attachments={message.attachments}/>
    }

    {
        message.url &&
        <Gif url={message.url}/>
    }

    {
        message.content && sharedKey && 
        <Message
         messageId={message._id}
         editMessageId={editMessageId}
         setEditMessageId={setEditMessageId}
         setOpenContextMenuMessageId={setOpenContextMenuMessageId}
         content={message.content}
         isGroupChat={isGroupChat}
         sharedKey={sharedKey}
         isEdited={message.isEdited}
        />

    }
    </>
  )
}
