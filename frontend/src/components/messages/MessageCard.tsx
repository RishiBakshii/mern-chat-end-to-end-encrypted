import { AnimatePresence, motion } from 'framer-motion';
import { memo } from "react";
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { RenderAppropriateMessage } from "./RenderAppropriateMessage";
import { IChatWithUnreadMessages } from '../../interfaces/chat';

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
            handlerFunc:()=>setEditMessageId(message._id)
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
    <motion.div initial={{x:-2}} animate={{x:0}} className={`flex gap-x-2 ${myMessage?"self-end":""} text-text relative`} onContextMenu={e=>handleContextMenuClick(e)}>

        <AnimatePresence>
            {
                isContextMenuOpen &&
                <motion.div variants={{hide:{opacity:0,y:-10},show:{opacity:1,y:0}}} initial="hide" exit="hide" animate="show" >
                    <ContextMenu options={contextOptions}/>
                </motion.div>
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
        
        <div className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} max-w-96 min-w-10 max-md:max-w-80 max-sm:max-w-64 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center`}>
            
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
        </div>
    </motion.div>
  )
})
