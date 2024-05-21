import { memo } from "react";
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { Gif } from "../ui/Gif";
import { AttachmentList } from "./AttachmentList";
import { EditMessageForm } from "./EditMessageForm";
import { Message } from "./Message";

type PropTypes = {
    editMessageId:string | undefined,
    isContextMenuOpen:boolean,
    myMessage:boolean;
    message:IMessage,
    isGroupChat:boolean,
    onContextMenuOpen:(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string) => void
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,editMessageId,isContextMenuOpen,setOpenContextMenuMessageId,setEditMessageId,onContextMenuOpen}:PropTypes) => {

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
              className="aspect-square object-cover w-12 self-start rounded-full" 
              src={message.sender.avatar} 
              alt={`${message.sender.username}`} 
            />
        }
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} max-w-96 min-w-16 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
            {
                isGroupChat && !myMessage &&
                <p className="text-primary-dark font-medium">{message.sender.username}</p>
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
