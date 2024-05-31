import { IMessage } from "../../interfaces/messages"
import { Gif } from "../ui/Gif"
import { AttachmentList } from "./AttachmentList"
import { EditMessageForm } from "./EditMessageForm"
import { Message } from "./Message"
import { PollCardForm } from "./PollCardForm"

type PropTypes = {
    isGroupChat:boolean
    myMessage:boolean
    message:IMessage
    editMessageId:string | undefined,
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const RenderAppropriateMessage = ({isGroupChat,myMessage,message,editMessageId,setEditMessageId,setOpenContextMenuMessageId}:PropTypes) => {
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
        message.content && 
        <Message 
         content={message.content} 
         isEdited={message.isEdited}
        />

    }
    </>
  )
}
