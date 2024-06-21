import { format } from 'date-fns';
import { EmojiClickData } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { memo, useEffect, useRef } from "react";
import { useDeleteReaction } from '../../hooks/useMessages/useDeleteReaction';
import { useSendNewReaction } from '../../hooks/useMessages/useSendNewReaction';
import { IChatWithUnreadMessages } from '../../interfaces/chat';
import type { IMessage } from "../../interfaces/messages";
import { ContextMenu } from "../shared/ContextMenu";
import { DeleteIcon } from '../ui/icons/DeleteIcon';
import { EditIcon } from '../ui/icons/EditIcon';
import { RenderAppropriateMessage } from "./RenderAppropriateMessage";
import { useClickOutside } from '../../hooks/useUtils/useClickOutside';

type PropTypes = {
    editMessageId:string | undefined,
    isContextMenuOpen:boolean,
    myMessage:boolean;
    message:IMessage,
    loggedInUserId:string
    isGroupChat:boolean,
    selectedChatDetails:IChatWithUnreadMessages,
    reactionMenuMessageId: string | undefined
    deleteMessage: ({ messageId }: {messageId: string}) => void
    onContextMenuOpen:(messageId: string) => void
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setReactionMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const MessageCard = memo(({message,myMessage=false,isGroupChat,reactionMenuMessageId,selectedChatDetails,loggedInUserId,editMessageId,isContextMenuOpen,setReactionMenuMessageId,deleteMessage,setOpenContextMenuMessageId,setEditMessageId,onContextMenuOpen}:PropTypes) => {
    
    const {sendNewReaction} = useSendNewReaction()
    const {deleteReaction} = useDeleteReaction()

    
    const reactionsRef = useRef<HTMLDivElement>(null)
    const contextMenuRef = useRef<HTMLDivElement>(null)

    useClickOutside(reactionsRef,()=>setReactionMenuMessageId(undefined))
    useClickOutside(contextMenuRef,()=>setOpenContextMenuMessageId(undefined))

    useEffect(()=>{
        if(message?.reactions?.length===0) setReactionMenuMessageId(undefined)
    },[message?.reactions?.length])

    const contextOptions = [
        {
            name:"Edit",
            icon:<EditIcon/>,
            handlerFunc:()=> {
                setOpenContextMenuMessageId(undefined)
                setEditMessageId(message._id)
            }
        },
        {
            name:"Unsend",
            icon:<DeleteIcon/>,
            handlerFunc:()=>deleteMessage({messageId:message._id})
        }
    ]

    const handleContextMenuClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        
        e.preventDefault()
        e.stopPropagation()
        onContextMenuOpen(isContextMenuOpen?'':message._id)
        
    }

    const handleReactionClick = (e:EmojiClickData)=>{
        if(message.reactions?.length>0 && message.reactions[0] && message.reactions.find(reaction=>reaction.user?._id === loggedInUserId)){
            deleteReaction({chatId:selectedChatDetails._id,messageId:message._id})
        }
        sendNewReaction({chatId:selectedChatDetails._id,messageId:message._id,reaction:e.emoji})

        setOpenContextMenuMessageId(undefined)
    }

    const handleDoubleClick = ()=>{
        const userReaction = message.reactions.find(reaction=>reaction?.user?._id === loggedInUserId)

        if(userReaction?.emoji!=="❤️"){
            deleteReaction({chatId:selectedChatDetails._id,messageId:message._id})
            sendNewReaction({chatId:selectedChatDetails._id,messageId:message._id,reaction:"❤️"})
        }
        else{
            
            if(userReaction?.emoji==="❤️"){
                deleteReaction({chatId:selectedChatDetails._id,messageId:message._id})
            }
            else{
                sendNewReaction({chatId:selectedChatDetails._id,messageId:message._id,reaction:"❤️"})
            }
        }



    }


  return (
    <motion.div initial={{x:-2}} animate={{x:0}} className={`flex gap-x-2 ${myMessage?"self-end":""} text-text relative `} onContextMenu={e=>handleContextMenuClick(e)}>


            {
                isContextMenuOpen &&
                    <ContextMenu
                        myMessage={myMessage}
                        ref={contextMenuRef}
                        options={message.content?contextOptions:contextOptions.filter(option=>option.name!=='Edit')}
                        onEmojiClick={handleReactionClick}
                    />
            }
        
        {
            !myMessage && 
            <img 
              className="aspect-square object-cover w-12 self-end rounded-full max-lg:w-10 max-sm:w-8" 
              src={message.sender.avatar} 
              alt={`${message.sender.username}`} 
            />
        }
        
        <div className='flex flex-col'>

                <motion.div whileTap={{scale:0.950}} onDoubleClick={handleDoubleClick} className={`${myMessage?"bg-primary text-white":"bg-secondary-dark"} ${isContextMenuOpen?"border-2 border-double border-spacing-4 border-":null} max-w-96 min-w-10 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center max-md:max-w-80 max-sm:max-w-64`}>
                    
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
                        
                        <div className='flex items-center ml-auto gap-x-1 flex-nowrap shrink-0'>
                            {
                                message?.isEdited && <p className="text-secondary font-medim text-sm max-sm:text-xs">Edited</p>
                            }       
                            <p className={`text-xs ${myMessage?'text-gray-200':"text-secondary-darker"}`}>{format(message.createdAt,'h:mm a').toLowerCase()}</p>
                        </div>
                        
                </motion.div>

                {
                    message?.reactions && message.reactions?.length>0 && 

                        <div onClick={()=>setReactionMenuMessageId(message._id)} className='bg-secondary-dark self-end px-1 rounded-lg flex items-center -mt-1 cursor-pointer'>
                            {
                                message.reactions.slice(0,4).map(reaction=>(
                                    <motion.p variants={{hide:{opacity:0,y:10,scale:1.5},show:{opacity:1,y:0,scale:1}}} initial="hide" animate="show">{reaction.emoji}</motion.p>
                                ))
                            }

                            {
                                (message.reactions.length - 4 )>0 && 
                                <span className='rounded-full'>+{(message.reactions.length - 4 ) }</span>
                            }
                        </div>
                }

                {
                    reactionMenuMessageId === message._id && message.reactions?.length>0 &&

                    <motion.div ref={reactionsRef} variants={{hide:{opacity:0,y:5},show:{opacity:1,y:0}}} initial="hide" animate="show"  className={`absolute bg-secondary-dark min-w-72 ${myMessage?"right-0":"left-0"} max-h-72 min-h-56  top-0 overflow-y-auto scroll-smooth p-4 rounded-md flex flex-col gap-y-4 z-10`}>

                        <h4 className='text-lg'>Reactions</h4>

                        <div className='flex flex-col gap-y-2'>
                            {
                                message.reactions.map(reaction=>(
                                    <div onClick={()=>reaction.user?._id === loggedInUserId ?deleteReaction({chatId:selectedChatDetails._id,messageId:message._id}):''} key={reaction.user?._id} className={`flex items-center justify-between ${reaction?.user?._id === loggedInUserId?"cursor-pointer":""}`}>

                                        <div className='flex items-center gap-x-3'>
                                            <img className='rounded-full size-10' src={reaction?.user?.avatar} alt={reaction?.user?.username} />
                                            
                                            <div className='flex flex-col'>
                                                <p>{reaction.user?.username}</p>
                                                {
                                                    reaction.user?._id === loggedInUserId && 
                                                    <p className='text-sm'>Tap to remove</p>
                                                }
                                            </div>
                                        </div>
                                        
                                        <span className='text-xl'>{reaction.emoji}</span>
                                        
                                    </div>
                                ))
                            }
                        </div>
                    </motion.div>
                }
        </div>

        
    </motion.div>
  )
})
