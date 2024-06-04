import { useEffect, useState } from "react"
import { IMessage } from "../../interfaces/messages"
import { Gif } from "../ui/Gif"
import { AttachmentList } from "./AttachmentList"
import { EditMessageForm } from "./EditMessageForm"
import { Message } from "./Message"
import { PollCardForm } from "./PollCardForm"
import { decryptMessage } from "../../utils/encryption"
import { useGetSharedKey } from "../../hooks/useAuth/useGetSharedKey"
import { IChatWithUnreadMessages } from "../../interfaces/chat"

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

  const [descryptedMessage,setDecryptedMessage] = useState<string>()
  const [sharedKey, setSharedKey] = useState<CryptoKey>()

  const otherMember = selectedChatDetails.members.filter(member=>member._id!==loggedInUserId)[0]

    
  useEffect(()=>{

    const handleSetSharedKey = async()=>{
      const key = await getSharedKey(loggedInUserId,otherMember)
      console.log(key);
      if(key){
        setSharedKey(key)
      }
    }

    handleSetSharedKey()
  },[])

  useEffect(()=>{

    const handleDecryptMessage = async(sharedKey:CryptoKey,encryptedMessage:string)=>{
  
      const msg = await decryptMessage(sharedKey,encryptedMessage)

      if(msg){
        setDecryptedMessage(msg)
      }

    }

    if(message.content?.length && sharedKey){
      handleDecryptMessage(sharedKey,message.content)
    }
  },[message.content,sharedKey])

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
        editMessageId === message._id  && message.content ?
        <EditMessageForm
          messageId={message._id}
          prevContentValue={message.content}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}

        />
        :
        message.content && descryptedMessage && 
        <Message 
         content={descryptedMessage} 
         isEdited={message.isEdited}
        />

    }
    </>
  )
}
