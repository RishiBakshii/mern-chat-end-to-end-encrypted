import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from "react"
import { useDeleteMessage } from '../../hooks/useMessages/useDeleteMessage'
import type { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import type { IMessage } from "../../interfaces/messages"
import { useLazyGetMessagesByChatIdQuery } from '../../services/api/messageApi'
import { TypingIndicatorWithUserList } from "../chat/TypingIndicatorWithUserList"
import { MessageCard } from "./MessageCard"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
  selectedChatDetails:IChatWithUnreadMessages
  messageContainerRef: React.RefObject<HTMLDivElement>
  totalPages:number
}
export const MessageList = ({messages,loggedInUserId,isGroupChat,totalPages,selectedChatDetails,messageContainerRef}:PropTypes) => {

  const [fetchMoreMessages,{isFetching}] = useLazyGetMessagesByChatIdQuery()


  const [page,setPage] = useState<number>(1)
  const [hasMore,setHasMore] = useState<boolean>(true)
  const prevHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0)

  const [isNearBottom, setIsNearBottom] = useState(true);

  const [openContextMenuMessageId, setOpenContextMenuMessageId] = useState<string>()
  const [editMessageId,setEditMessageId] = useState<string>()

  const deleteMessage = useDeleteMessage()

  const handleSetOpenContextMenuMessageId=useCallback((e:React.MouseEvent<HTMLDivElement, MouseEvent>,messageId: string)=>{
    e.stopPropagation()
    e.preventDefault()
    setOpenContextMenuMessageId(messageId)
  },[])

  useEffect(()=>{
    const container = messageContainerRef.current

    if(container){

      const timeoutId = setTimeout(() => {
        container.scrollTop = container.scrollHeight
      }, 100);

      return ()=> {
        setPage(1)
        setHasMore(true)
        clearTimeout(timeoutId)
      }

    }
  },[selectedChatDetails])

  const handleScroll = useCallback(() => {
    const container = messageContainerRef.current;
  
    if (container) {
      // Check if we are close to the top to load more messages
      if (container.scrollTop <= 284 && hasMore && !isFetching) {
        prevHeightRef.current = container.scrollHeight;
        prevScrollTopRef.current = container.scrollTop;
        setPage((prev) => prev + 1);
      }
  
      // Check if we are near the bottom
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
      setIsNearBottom(isAtBottom);
    }
  }, [hasMore, isFetching]);
  

  useEffect(()=>{

    if(page>1){

      fetchMoreMessages({_id:selectedChatDetails._id,page})

      if(page === totalPages){
        setHasMore(false)
        return
      }

    }

  },[page,totalPages,selectedChatDetails])

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {

      if (isNearBottom) {
        prevHeightRef.current = 0;
        prevScrollTopRef.current = 0
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 10);
      } 

    }
  }, [messages]);

  useEffect(()=>{
    const container = messageContainerRef.current;

    if(page>1 && container){

      if(!isFetching){
        container.scrollTop = container.scrollHeight - prevHeightRef.current + prevScrollTopRef.current
      }

    }
  },[isFetching,page])


  return (
    <>
    {/* <p className='text-text'> total page {totalPages}</p>
    <p className='text-text'>page {page}</p>
    <p className='text-text'>isFetcing {isFetching?"true":"false"}</p>
    <p className='text-text'>bottom {isNearBottom?"true":"false"}</p> */}
    <div ref={messageContainerRef} onScroll={handleScroll} className="flex h-full flex-col gap-y-4 max-xl:gap-y-2 overflow-y-auto overflow-x-hidden">
      {
        isFetching &&
        
      <div role="status" className='self-center'>
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>

      }
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
    </>
  )
}