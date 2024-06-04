import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from "react"
import type { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import type { IMessage } from "../../interfaces/messages"
import { TypingIndicatorWithUserList } from "../chat/TypingIndicatorWithUserList"
import { MessageCard } from "./MessageCard"
import { useDeleteMessage } from '../../hooks/useMessages/useDeleteMessage'

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
  selectedChatDetails:IChatWithUnreadMessages
  totalPages:number
  fetchMoreMessages: (_id: string, page: number) => void
  messageContainerRef: React.RefObject<HTMLDivElement>
}
export const MessageList = ({messages,loggedInUserId,isGroupChat,selectedChatDetails,totalPages,fetchMoreMessages,messageContainerRef}:PropTypes) => {

  const [page,setPage] = useState<number>(1)
  const [hasMore,setHasMore] = useState<boolean>(true)
  const prevHeightRef = useRef<number>(0);
  const [loading,setLoading] = useState<boolean>(false)
  const [prevLoading,setPrevLoading] = useState<boolean>(false)

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>()
  const [editMessageId,setEditMessageId] = useState<string>()

  const deleteMessage = useDeleteMessage()


  useEffect(()=>{
    if(messageContainerRef.current && messageContainerRef.current.scrollTop !== messageContainerRef.current.scrollHeight){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  },[selectedChatDetails.userTyping])

  useEffect(()=>{
    setHasMore(true)
    setPage(1)
  },[selectedChatDetails])

  useEffect(()=>{
    if(loading){
      setTimeout(() => {
        setLoading(false)
      },500);
    }
  },[loading])

  useEffect(()=>{

    if(page>1){

      setLoading(true)
  
      if(page===totalPages+1){
        setHasMore(false)
        return
      }
      
      setPrevLoading(true)
      fetchMoreMessages(selectedChatDetails._id,page)

    }

  },[page])

  // for maintaing the scroll position
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container && page > 1 && prevLoading) {
      container.scrollTop = container.scrollHeight - prevHeightRef.current;
      setPrevLoading(false)
    }
  }, [messages]);

  useEffect(()=>{
    const container = messageContainerRef.current;
    if(!prevLoading && container && !loading){
      container.scrollTop = container.scrollHeight
    }
  },[messages,prevLoading])



  const handleScroll = ()=>{
    const threshold = 284
    if(messageContainerRef.current && messageContainerRef.current.scrollTop < threshold && hasMore && !loading) {
      prevHeightRef.current = messageContainerRef.current.scrollHeight;
      setPage(prev=>prev+1)
    }
  }

  const handleSetOpenContextMenuMessageId=(e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string)=>{
    e.stopPropagation()
    e.preventDefault()
    setOpenContextMenuMessageId(messageId)
  }

  return (
    <div  ref={messageContainerRef} onScroll={handleScroll} className="flex h-full flex-col gap-y-4 max-xl:gap-y-2 overflow-y-auto overflow-x-hidden">

      {messages?.map((message,index) => (

        <MessageCard
          key={index}
          selectedChatDetails={selectedChatDetails}
          loggedInUserId={loggedInUserId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          setEditMessageId={setEditMessageId}
          editMessageId={editMessageId}
          onContextMenuOpen={handleSetOpenContextMenuMessageId}
          deleteMessage={deleteMessage}
          isContextMenuOpen={openContextMenuMessageId===message._id}
          isGroupChat={isGroupChat} 
          message={message}
          myMessage={loggedInUserId===message.sender._id} 
        />

      ))}

      <AnimatePresence>
      {
        selectedChatDetails.userTyping?.length > 0 && 
        <motion.div className="w-fit" variants={{hide:{opacity:0,x:-10},show:{opacity:1,x:0}}} initial="hide" animate="show" exit="hide">
            <TypingIndicatorWithUserList
              isGroupChat={selectedChatDetails.isGroupChat}
              users={selectedChatDetails.userTyping}
            />
        </motion.div>
      }
      </AnimatePresence>


    </div>
  )
}