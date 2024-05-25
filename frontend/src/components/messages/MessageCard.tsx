import { memo } from "react";
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { Gif } from "../ui/Gif";
import { AttachmentList } from "./AttachmentList";
import { EditMessageForm } from "./EditMessageForm";
import { Message } from "./Message";
import { PollCardForm } from "./PollCardForm";
import { IChatWithUnreadMessages } from "../../interfaces/chat";

type PropTypes = {
    editMessageId:string | undefined,
    isContextMenuOpen:boolean,
    myMessage:boolean;
    message:IMessage,
    isGroupChat:boolean,
    selectedChatDetails:IChatWithUnreadMessages
    loggedInUserId:string
    onContextMenuOpen:(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string) => void
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,loggedInUserId,editMessageId,isContextMenuOpen,setOpenContextMenuMessageId,setEditMessageId,onContextMenuOpen,selectedChatDetails}:PropTypes) => {

    const contextOptions = [
        {
            name:"Edit message",
            handlerFunc:()=>setEditMessageId(message._id)
        }
    ]

    const handleContextMenuClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        
        e.preventDefault()
        e.stopPropagation()
        
        if(myMessage && message.content){
            onContextMenuOpen(e,message._id)
        }
    }

  return (
    <div className={`flex gap-x-2 ${myMessage?"self-end":""} text-text relative`} onContextMenu={e=>handleContextMenuClick(e)}>

        {
            isContextMenuOpen &&
            <ContextMenu options={contextOptions}/>
        }
 
        {
            !myMessage && 
            <img 
              className="aspect-square object-cover w-12 self-end rounded-full max-lg:w-10 max-sm:w-8" 
              src={message.sender.avatar} 
              alt={`${message.sender.username}`} 
            />
        }
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} max-w-96 min-w-10 max-md:max-w-80 max-sm:max-w-64 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
            {
                isGroupChat && !myMessage &&
                <p className="text-primary-dark font-medium">{message.sender.username}</p>
            }
            
            {
                message.isPoll && message.pollQuestion &&
                <PollCardForm
                   loggedInUserId={loggedInUserId}
                   messageId={message._id}
                   selectedChatDetails={selectedChatDetails}
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
        </div>
    </div>
  )
})
