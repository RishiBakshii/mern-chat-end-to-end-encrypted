import { motion } from 'framer-motion'
import { useRef } from "react"
import { Helmet } from "react-helmet-async"
import { ChatDetails } from "../components/chat/ChatDetails"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MessageForm } from "../components/chat/MessageForm"
import { MessageList } from "../components/messages/MessageList"
import { ChatListWithSearchSkeleton } from "../components/ui/skeleton/ChatListWithSearchSkeleton"
import { useFetchAttachments } from "../hooks/useAttachment/useFetchAttachments"
import { useCallOut } from "../hooks/useCallIn/useCallOut"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useCallInRejectListener } from "../hooks/useEventListeners/useCallInRejectListener"
import { useCallInRequestListener } from "../hooks/useEventListeners/useCallInRequestListener"
import { useCallOutListener } from "../hooks/useEventListeners/useCallOutListener"
import { useCallInAcceptListener } from "../hooks/useEventListeners/useCallinAcceptListener"
import { useDeleteChatListener } from "../hooks/useEventListeners/useDeleteChatListener"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
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
import { useClearAdditionalMessagesOnChatChange } from "../hooks/useMessages/useClearAdditionalMessagesOnChatChange"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useToggleChatBar } from "../hooks/useUI/useToggleChatBar"
import { useToggleChatDetailsBar } from "../hooks/useUI/useToggleChatDetailsBar"
import { useToggleGif } from "../hooks/useUI/useToggleGif"
import { useTogglePoolForm } from "../hooks/useUI/useTogglePoolForm"
import { useGetChatAvatar } from "../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useMediaQuery } from "../hooks/useUtils/useMediaQuery"
import { useNotificationPermission } from '../hooks/useUtils/useNotificationPermission'
import { useFetchFriendRequest } from "../hooks/userRequest/useFetchFriendRequest"
import { ICallOutEventPayloadData } from "../interfaces/callIn"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { selectChatBar, selectChatDetailsBar } from "../services/redux/slices/uiSlice"
import { useAppSelector } from "../services/redux/store/hooks"
import Lottie from 'lottie-react'
import { fishAnimation } from '../assets'

export const ChatPage = () => {

    
    const is640 =  useMediaQuery(640)
    
    const {isChatsFetching,chats} = useFetchChats()
    useFetchFriends()
    useFetchFriendRequest()
    
    const loggedInUser = useAppSelector(selectLoggedInUser)
    const chatBar = useAppSelector(selectChatBar)
    const chatDetailsBar = useAppSelector(selectChatDetailsBar)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const messageContainerRef = useRef<HTMLDivElement>(null)
    
    
    
    const {totalMessagePages,messages} = useFetchMessages(selectedChatDetails?._id,1)
    
    const {fetchMoreAttachments,sharedMedia,isAttachmentsFetching} = useFetchAttachments()
    
    const updateSelectedChatId = useUpdateChatSelection()
    const toggleChatBar = useToggleChatBar()
    const toggleChatDetailsBar = useToggleChatDetailsBar()
    
    const clearExtraPreviousMessages = useClearAdditionalMessagesOnChatChange()
    
    
    useNotificationPermission()

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
   
   useUpdateUnreadChatAsSeen()
   
   const toggleGif = useToggleGif()
   const togglePoolForm = useTogglePoolForm()
 
   const getChatName=useGetChatName()
   const getChatAvatar = useGetChatAvatar()
   
   const chatName = getChatName(selectedChatDetails,loggedInUser?._id)
   const chatAvatar= getChatAvatar(selectedChatDetails,loggedInUser?._id)

   const callOut = useCallOut()

   const handleCallOut = (payload: ICallOutEventPayloadData)=>{
    callOut(payload)
    // removeSpectatorById({spectatorChatId:payload.chat.chatId,spectatorId:payload.callee._id})

   }

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
        
        <div className="h-full w-full flex p-4 gap-x-6 bg-background">

                <motion.div 
                    variants={{hide:{right:"50rem"},show:{left:0,right:0}}} 
                    initial="hide" 
                    animate={chatBar?"show":"hide"} 
                    transition={{duration:.4,type:"spring"}}
                    className={`flex-[.5] min-w-[15rem] p-2 bg-background max-md:fixed overflow-y-auto h-full z-10`}>
                    
                    {
                        !isChatsFetching && chats && loggedInUser?

                        <ChatListWithSearch
                            clearExtraPreviousMessages={clearExtraPreviousMessages}
                            chats={chats}
                            selectedChatDetails={selectedChatDetails}
                            loggedInUserId={loggedInUser._id}
                            toggleChatBar={toggleChatBar}
                            updateSelectedChatId={updateSelectedChatId}
                            getChatAvatar={getChatAvatar}
                            getChatName={getChatName}
                        />
                        :
                        <ChatListWithSearchSkeleton/>
                    }
                    
                </motion.div>

                <div className="flex-[1.6]">

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
                                    spectators={selectedChatDetails.spectators}
                                    selectedChatDetails={selectedChatDetails}
                                    totalMembers={selectedChatDetails.members.length}
                                    toggleChatDetailsBar={toggleChatDetailsBar}
                                    handleCallOut={handleCallOut}
                                />
                            }

                            {
                                selectedChatDetails && messages && loggedInUser && totalMessagePages &&

                                <MessageList
                                    messages={messages}
                                    totalPages={totalMessagePages}
                                    messageContainerRef={messageContainerRef}
                                    selectedChatDetails={selectedChatDetails}
                                    isGroupChat={selectedChatDetails.isGroupChat} 
                                    loggedInUserId={loggedInUser._id}
                                />
                            }
                            
                            {
                                selectedChatDetails &&

                                <MessageForm 
                                toggleGif={toggleGif}
                                togglePoolForm={togglePoolForm}
                                />  
                            }

                            {
                                !selectedChatDetails && 
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}} className='w-96 max-sm:w-full self-center justify-self-center flex flex-col justify-center items-center relative'>
                                    <Lottie animationData={fishAnimation} loop={false}/>
                                    <div className='absolute bottom-0 flex flex-col items-center'>
                                        <motion.h4 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}} className='text-text text-fluid-h6'>Select a chat</motion.h4>
                                        <motion.h4 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}} className='text-text text-fluid-h6'>and start the conversation</motion.h4>
                                    </div>
                                </motion.div>
                            }

                        </div>
                        
                </div>

                <motion.div 
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
