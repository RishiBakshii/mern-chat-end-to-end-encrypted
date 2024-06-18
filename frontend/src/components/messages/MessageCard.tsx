import { AnimatePresence, motion } from 'framer-motion';
import { memo } from "react";
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { RenderAppropriateMessage } from "./RenderAppropriateMessage";
import { IChatWithUnreadMessages } from '../../interfaces/chat';
import { format } from 'date-fns';

type PropTypes = {
    editMessageId:string | undefined,
    isContextMenuOpen:boolean,
    myMessage:boolean;
    message:IMessage,
    loggedInUserId:string
    isGroupChat:boolean,
    selectedChatDetails:IChatWithUnreadMessages,
    deleteMessage: ({ messageId }: {messageId: string}) => void
    onContextMenuOpen:(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string) => void
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,selectedChatDetails,loggedInUserId,editMessageId,isContextMenuOpen,deleteMessage,setOpenContextMenuMessageId,setEditMessageId,onContextMenuOpen}:PropTypes) => {

    const contextOptions = [
        {
            name:"Edit",
            handlerFunc:()=> {
                setOpenContextMenuMessageId(undefined)
                setEditMessageId(message._id)
            }
        },
        {
            name:"Delete",
            handlerFunc:()=>deleteMessage({messageId:message._id})
        }
    ]

    const handleContextMenuClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        
        e.preventDefault()
        e.stopPropagation()
        
        if(myMessage && message.content){
            onContextMenuOpen(e,isContextMenuOpen?'':message._id)
        }
    }

  return (
    <motion.div initial={{x:-2}} animate={{x:0}} className={`flex gap-x-2 ${myMessage?"self-end":""} text-text relative `} onContextMenu={e=>handleContextMenuClick(e)}>

        <AnimatePresence>
            {
                isContextMenuOpen &&
                    <ContextMenu 
                        options={contextOptions}
                        setOpenContextMenuMessageId={setOpenContextMenuMessageId}
                    />
            }
        </AnimatePresence>

        {
            !myMessage && 
            <img 
              className="aspect-square object-cover w-12 self-end rounded-full max-lg:w-10 max-sm:w-8" 
              src={message.sender.avatar} 
              alt={`${message.sender.username}`} 
            />
        }
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} ${isContextMenuOpen?"border-2 border-double select-none border-spacing-4 border-":null} max-w-96 min-w-10 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center max-md:max-w-80 max-sm:max-w-64`}>
            
                <RenderAppropriateMessage
                   editMessageId={editMessageId}
                   loggedInUserId={loggedInUserId}
                   selectedChatDetails={selectedChatDetails}
                   isGroupChat={isGroupChat}
                   message={message}
                   myMessage={myMessage}
                   setEditMessageId={setEditMessageId}
                   setOpenContextMenuMessageId={setOpenContextMenuMessageId}
                />

                <p className={`ml-auto text-xs ${myMessage?'text-gray-200':"text-secondary-darker"}`}>{format(message.createdAt,'h:mm a').toLowerCase()}</p>
        </div>
    </motion.div>
  )
})
