import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useRef } from "react"
import { Helmet } from "react-helmet-async"
import { fishAnimation } from '../assets'
import { ChatDetails } from "../components/chat/ChatDetails"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MessageForm } from "../components/chat/MessageForm"
import { MessageList } from "../components/messages/MessageList"
import { ChatListWithSearchSkeleton } from "../components/ui/skeleton/ChatListWithSearchSkeleton"
import { MessageListSkeleton } from '../components/ui/skeleton/MessageListSkeleton'
import { useFetchAttachments } from "../hooks/useAttachment/useFetchAttachments"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useCallInRejectListener } from "../hooks/useEventListeners/useCallInRejectListener"
import { useCallInRequestListener } from "../hooks/useEventListeners/useCallInRequestListener"
import { useCallOutListener } from "../hooks/useEventListeners/useCallOutListener"
import { useCallInAcceptListener } from "../hooks/useEventListeners/useCallinAcceptListener"
import { useDeleteChatListener } from "../hooks/useEventListeners/useDeleteChatListener"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
import { useGroupUpdateEventListener } from '../hooks/useEventListeners/useGroupUpdateEventListener'
import { useJoinNewChatListener } from '../hooks/useEventListeners/useJoinNewChatListener'
import { useMemberRemovedListener } from "../hooks/useEventListeners/useMemberRemovedListener"
import { useMessageDeleteListener } from '../hooks/useEventListeners/useMessageDeleteListener'
import { useMessageEditListener } from "../hooks/useEventListeners/useMessageEditListener"
import { useMessageListener } from "../hooks/useEventListeners/useMessageListener"
import { useMessageSeenListener } from "../hooks/useEventListeners/useMessageSeenListener"
import { useNewGroupListener } from "../hooks/useEventListeners/useNewGroupListener"
import { useNewMemberAddedListener } from "../hooks/useEventListeners/useNewMemberAddedListener"
import { useOfflineListener } from "../hooks/useEventListeners/useOfflineListener"
import { useOnlineListener } from "../hooks/useEventListeners/useOnlineListener"
import { useOnlineUsersListener } from "../hooks/useEventListeners/useOnlineUsersListener"
import { useSpectatorJoinedListener } from "../hooks/useEventListeners/useSpectatorJoinedListener"
import { useTypingListener } from "../hooks/useEventListeners/useTypingListener"
import { useUnreadMessageListener } from "../hooks/useEventListeners/useUnreadMessageListener"
import { useVoteInListener } from "../hooks/useEventListeners/useVoteInListener"
import { useVoteOutListener } from "../hooks/useEventListeners/useVoteOutListener"
import { useFetchFriends } from "../hooks/useFriend/useFetchFriends"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useToggleChatBar } from "../hooks/useUI/useToggleChatBar"
import { useToggleChatDetailsBar } from "../hooks/useUI/useToggleChatDetailsBar"
import { useCheckFcmTokenExists } from '../hooks/useUtils/useCheckFcmTokenExists'
import { useGetChatAvatar } from "../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useMediaQuery } from "../hooks/useUtils/useMediaQuery"
import { useSwipe } from '../hooks/useUtils/useSwipe'
import { useFetchFriendRequest } from "../hooks/userRequest/useFetchFriendRequest"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails, selectSelectedChatId } from "../services/redux/slices/chatSlice"
import { selectChatBar, selectChatDetailsBar, setChatBar, setChatDetailsBar } from "../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../services/redux/store/hooks"
import { useNewReactionListener } from '../hooks/useEventListeners/useNewReactionListener'
import { useDeleteReactionListener } from '../hooks/useEventListeners/useDeleteReactionListener'

export const ChatPage = () => {

    
    const is640 =  useMediaQuery(640)

    const dispatch = useAppDispatch()
    useCheckFcmTokenExists()
    useFetchFriends()
    useFetchFriendRequest()
    const {updateChatSelection} = useUpdateChatSelection()
    
    const {isChatsFetching,chats} = useFetchChats()

    const toggleChatBar = useToggleChatBar()
    const toggleChatDetailsBar = useToggleChatDetailsBar()
    
    const loggedInUser = useAppSelector(selectLoggedInUser)
    const chatBar = useAppSelector(selectChatBar)
    const chatDetailsBar = useAppSelector(selectChatDetailsBar)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const messageContainerRef = useRef<HTMLDivElement>(null)

    
    const chatLeftSwipe = ()=>{
        dispatch(setChatDetailsBar(true))
    }
    
    const chatRightSwipe = ()=>{
        if(chatDetailsBar){
            dispatch(setChatDetailsBar(false))
        }
        else{
            dispatch(setChatBar(true))
        }
    }


    
    const { onTouchStart:onTouchStartChat, onTouchMove:onTouchMoveChat, onTouchEnd:onTouchEndChat } = useSwipe(75,1536,chatLeftSwipe,chatRightSwipe);
    const { onTouchStart:onTouchStartDefault, onTouchMove:onTouchMoveDefault, onTouchEnd:onTouchEndDefault } = useSwipe(75,768,()=>{},()=>dispatch(setChatBar(true)));


    const { onTouchStart:onTouchStartChatBar, onTouchMove:onTouchMoveChatBar, onTouchEnd:onTouchEndChatBar } = useSwipe(75,768,()=>dispatch(setChatBar(false)),()=>{});
    const { onTouchStart:onTouchStartChatDetails, onTouchMove:onTouchMoveChatDetails, onTouchEnd:onTouchEndChatDetails } = useSwipe(75,640,()=>{},()=>dispatch(setChatDetailsBar(false)));


    
    
    

    const {totalMessagePages,messages,isMessagesLoading} = useFetchMessages()
    
    const {fetchMoreAttachments,sharedMedia,isAttachmentsFetching} = useFetchAttachments()
    
    
   // listeners
   useFriendRequestListener()
   useMessageListener()
   useMessageSeenListener()
   useNewGroupListener()
   useUnreadMessageListener()
   useOfflineListener()
   useOnlineListener()
   useTypingListener()
   useNewMemberAddedListener()
   useMessageEditListener()
   useDeleteChatListener()
   useMemberRemovedListener()
   useVoteInListener()
   useVoteOutListener()
   useOnlineUsersListener()
   useCallInRequestListener()
   useCallInAcceptListener()
   useCallInRejectListener()
   useCallOutListener()
   useSpectatorJoinedListener()
   useMessageDeleteListener()
   useGroupUpdateEventListener()
   useJoinNewChatListener()
   useNewReactionListener()
   useDeleteReactionListener()
   
   useUpdateUnreadChatAsSeen()
   
 
   const getChatName=useGetChatName()
   const getChatAvatar = useGetChatAvatar()
   
   const chatName = getChatName(selectedChatDetails,loggedInUser?._id)
   const chatAvatar= getChatAvatar(selectedChatDetails,loggedInUser?._id)

   const handleFetchMoreAttachments = (chatId:string,page:number)=>{
        fetchMoreAttachments({chatId,page})
   }

   
  return (
    <>
        <Helmet>
            <title>Chat - Baatchit</title>
            <meta name="description" content="Real-time messaging, group chats, file sharing, GIFs, and typing indicators. Stay connected with friends, see who's online, and enjoy seamless communication!" />
            <link rel="canonical" href={`${window.location.origin}`} />
        </Helmet>
        
        <div className="h-full w-full flex p-4 max-md:p-2 gap-x-6 bg-background">

                <motion.div

                    onTouchEnd={onTouchEndChatBar}
                    onTouchStart={onTouchStartChatBar}
                    onTouchMove={onTouchMoveChatBar}

                    variants={{hide:{right:"50rem"},show:{left:0,right:0}}} 
                    initial="hide" 
                    animate={chatBar?"show":"hide"} 
                    transition={{duration:.4,type:"spring"}}
                    className={`flex-[.5] min-w-[15rem] p-2 bg-background max-md:fixed h-full max-md:pb-20 overflow-y-auto z-10`}>
                    
                    {
                        !isChatsFetching && chats && loggedInUser?

                        <ChatListWithSearch
                            chats={chats}
                            selectedChatDetails={selectedChatDetails}
                            loggedInUserId={loggedInUser._id}
                            toggleChatBar={toggleChatBar}
                            updateSelectedChatId={updateChatSelection}
                            getChatAvatar={getChatAvatar}
                            getChatName={getChatName}
                        />
                        :
                        <ChatListWithSearchSkeleton/>
                    }
                    
                </motion.div>

                <div
                    onTouchEnd={onTouchEndChat}
                    onTouchStart={onTouchStartChat}
                    onTouchMove={onTouchMoveChat}
                    className="flex-[1.6]">

                        <div className="flex flex-col gap-y-3 h-full justify-between relative">
                            
                            {
                                selectedChatDetails && chatName && loggedInUser && chatName && chatAvatar && 

                                <ChatHeader
                                    lastSeen={selectedChatDetails.isGroupChat?null:selectedChatDetails.members.filter(member=>member._id!==loggedInUser._id)[0].lastSeen}
                                    isGroupChat={selectedChatDetails.isGroupChat}
                                    chatAvatar={chatAvatar}
                                    selectedChatName={chatName}
                                    loggedInUserId={loggedInUser._id}
                                    chatName={chatName}
                                    selectedChatDetails={selectedChatDetails}
                                    totalMembers={selectedChatDetails.members.length}
                                    toggleChatDetailsBar={toggleChatDetailsBar}
                                />
                            }

                            {
                                (!isMessagesLoading && messages!==undefined && selectedChatDetails && loggedInUser && totalMessagePages)?
                                <MessageList
                                    key={selectedChatId}
                                    messages={messages}
                                    totalPages={totalMessagePages}
                                    messageContainerRef={messageContainerRef}
                                    selectedChatDetails={selectedChatDetails}
                                    isGroupChat={selectedChatDetails.isGroupChat} 
                                    loggedInUserId={loggedInUser._id}
                                />
                                :
                                selectedChatDetails && isMessagesLoading &&
                                <MessageListSkeleton/>
                            }
                            
                            {
                                selectedChatDetails && <MessageForm />  
                            }

                            {
                                !selectedChatDetails && 
                                <motion.div 
                                    onTouchEnd={onTouchEndDefault} 
                                    onTouchStart={onTouchStartDefault} 
                                    onTouchMove={onTouchMoveDefault} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}} className='w-96 max-md:w-full max-md:h-full self-center justify-self-center flex flex-col justify-center items-center relative'>
                                    
                                    <div className='relative'>
                                        <Lottie animationData={fishAnimation} loop={false}/>
                                        <div className='absolute bottom-0 flex flex-col items-center right-0 left-0'>
                                            <motion.h4 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}} className='text-text text-fluid-h6'>Select a chat</motion.h4>
                                            <motion.h4 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}} className='text-text text-fluid-h6'>and start the conversation</motion.h4>
                                        </div>
                                    </div>
                                </motion.div>
                            }

                        </div>
                        
                </div>

                <motion.div 
                   
                    onTouchMove={onTouchMoveChatDetails}
                    onTouchEnd={onTouchEndChatDetails}
                    onTouchStart={onTouchStartChatDetails}

                    variants={{hide:{right:is640?"-40rem":"-26rem"},show:{right:0}}}
                    initial="hide"
                    animate={chatDetailsBar?"show":"hide"}
                    transition={{type:"spring",duration:.4}}
                    className="flex-[.6] bg-background max-sm:w-full max-2xl:fixed max-2xl:px-4 max-2xl:w-[25rem]">
                    {
                        !isChatsFetching && chats && loggedInUser && selectedChatDetails && chatName && chatAvatar && sharedMedia &&

                        <ChatDetails
                            isAdmin={selectedChatDetails.admin===loggedInUser._id}
                            isGroupChat={selectedChatDetails.isGroupChat}
                            chatName={chatName}
                            chatAvatar={chatAvatar}
                            members={selectedChatDetails.members}
                            attachments={sharedMedia}
                            isAttachmentsFetching={isAttachmentsFetching}
                            selectedChatId={selectedChatDetails._id}
                            toggleChatDetailsBar={toggleChatDetailsBar}
                            fetchMoreAttachments={handleFetchMoreAttachments}
                        />
                    }
                </motion.div>
                
        </div>
    </>
  )
}
