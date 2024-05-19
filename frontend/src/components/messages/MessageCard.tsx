import { memo, useEffect, useState } from "react";
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { EditMessageForm } from "./EditMessageForm";

type PropTypes = {
    editMessageId:string,
    isContextMenuOpen:boolean,
    onContextMenuOpen:(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string) => void
    setEditMessageId: React.Dispatch<React.SetStateAction<string>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string>>
    isAttachment:boolean
    attachments?:Array<string>
    myMessage:boolean;
    isTextMessage:boolean
    message:IMessage,
    isGroupChat:boolean,
    url:string
    isEdited:boolean | undefined
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,editMessageId,isEdited,setOpenContextMenuMessageId,setEditMessageId,isTextMessage,url,isAttachment,attachments,isContextMenuOpen,onContextMenuOpen}:PropTypes) => {


    const [readMore,SetReadMore] = useState<boolean>(message?.content?.length>500?true:false)
    const [isMessageBig] = useState<boolean>(message?.content?.length>500)

    useEffect(()=>{
     setOpenContextMenuMessageId("")
    },[editMessageId,message._id])

    const handleReadMoreOrLess = () => {
        SetReadMore(!readMore)
    }

  return (
    <div className={`flex gap-x-2 ${myMessage?"self-end":""} text-text relative`} onContextMenu={(e)=>onContextMenuOpen(e,message._id)}>

        {
            isContextMenuOpen &&
            <ContextMenu 
                options={[
                    {name:"Edit message",handlerFunc:()=>setEditMessageId(message._id)}
                ]}
            />
        }

        {
            // only shows avatar image on other's message
            !myMessage && 

            <img className="aspect-square object-cover w-12 self-start rounded-full" 
              src={message.sender.avatar} 
              alt={`${message.sender.username} avatar`} 
            />
        }
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} max-w-96 min-w-16 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
            {
                // only shows username on message when on group chat and message is of other user
                !myMessage && isGroupChat &&
                <p className="text-violet-500 font-medium">{message.sender.username}</p>
            }
            
            <p className={`justify-self-center w-full text-wrap break-words`}>
                

                {
                    isAttachment ?
                    attachments?.map(attachment=>(
                        <img src={attachment} alt="" />
                    ))
                    :
                    isTextMessage ? (
                        
                        editMessageId === message._id ? 
                        <EditMessageForm 
                          setEditMessageId={setEditMessageId}
                          prevContentValue={message.content}
                          messageId={message._id}
                        />
                        :
                        readMore?
                        message.content.substring(0,500):
                        message.content
                    )
                    :
                    <img src={url} alt="gif" />
                }
                {
                    isMessageBig && 
                    <span 
                        className="font-medium" 
                        onClick={handleReadMoreOrLess}>
                        {readMore?" read more...":" read less"}
                    </span>
                }
            </p>
            {
                isEdited && 
                <p className="text-primary-dark self-end font-semibold text-sm">Edited</p>
            }
        </div>
    </div>
  )
})
