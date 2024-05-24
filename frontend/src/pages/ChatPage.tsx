import { useRef } from "react"
import { Helmet } from "react-helmet-async"
import { ChatDetails } from "../components/chat/ChatDetails"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MessageForm } from "../components/chat/MessageForm"
import { SeenByList } from "../components/chat/SeenByList"
import { TypingIndicatorWithUserList } from "../components/chat/TypingIndicatorWithUserList"
import { MessageList } from "../components/messages/MessageList"
import { ChatListWithSearchSkeleton } from "../components/ui/skeleton/ChatListWithSearchSkeleton"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useDeleteChatListener } from "../hooks/useEventListeners/useDeleteChatListener"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
import { useMemberRemovedListener } from "../hooks/useEventListeners/useMemberRemovedListener"
import { useMessageEditListener } from "../hooks/useEventListeners/useMessageEditListener"
import { useMessageListener } from "../hooks/useEventListeners/useMessageListener"
import { useMessageSeenListener } from "../hooks/useEventListeners/useMessageSeenListener"
import { useNewGroupListener } from "../hooks/useEventListeners/useNewGroupListener"
import { useNewMemberAddedListener } from "../hooks/useEventListeners/useNewMemberAddedListener"
import { useOfflineListener } from "../hooks/useEventListeners/useOfflineListener"
import { useOnlineListener } from "../hooks/useEventListeners/useOnlineListener"
import { useTypingListener } from "../hooks/useEventListeners/useTypingListener"
import { useUnreadMessageListener } from "../hooks/useEventListeners/useUnreadMessageListener"
import { useFetchFriends } from "../hooks/useFriend/useFetchFriends"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useOpenRemoveMemberForm } from "../hooks/useUI/useOpenRemoveMemberForm"
import { useToggleChatBar } from "../hooks/useUI/useToggleChatBar"
import { useToggleChatDetailsBar } from "../hooks/useUI/useToggleChatDetailsBar"
import { useToggleGif } from "../hooks/useUI/useToggleGif"
import { useGetChatAvatar } from "../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useScrollToBottom } from "../hooks/useUtils/useScrollToBottom"
import { useFetchFriendRequest } from "../hooks/userRequest/useFetchFriendRequest"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { selectChatBar, selectChatDetailsBar } from "../services/redux/slices/uiSlice"
import { useAppSelector } from "../services/redux/store/hooks"
import { useFetchAttachments } from "../hooks/useAttachment/useFetchAttachments"

export const ChatPage = () => {


   const {isChatsFetching,chats} = useFetchChats()
   useFetchFriends()
   useFetchFriendRequest()
   
   const loggedInUser = useAppSelector(selectLoggedInUser)
   const chatBar = useAppSelector(selectChatBar)
   const chatDetailsBar = useAppSelector(selectChatDetailsBar)
   const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
   const messageContainerRef = useRef<HTMLDivElement>(null)
   
   const {isMessagesFetching,messages} = useFetchMessages(selectedChatDetails?._id)
   const {fetchMoreAttachments,sharedMedia,isAttachmentsFetching} = useFetchAttachments()

   const updateSelectedChatId = useUpdateChatSelection()
   const toggleChatBar = useToggleChatBar()
   const toggleChatDetailsBar = useToggleChatDetailsBar()
   
   useScrollToBottom(messageContainerRef,[messages,selectedChatDetails],0)
   
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
   
   useUpdateUnreadChatAsSeen(selectedChatDetails)
   
   const toggleGif = useToggleGif()
   const openRemoveMemberForm = useOpenRemoveMemberForm()

   const getChatName=useGetChatName()
   const getChatAvatar = useGetChatAvatar()
   
   const chatName = getChatName(selectedChatDetails,loggedInUser?._id)
   const chatAvatar= getChatAvatar(selectedChatDetails,loggedInUser?._id)

   const handleFetchMoreAttachments = (chatId:string,page:number)=>{
        fetchMoreAttachments({chatId,page},true)
   }

  return (
    <>
    <Helmet>
        <title>Chat - Baatchit</title>
        <meta name="description" content="Real-time messaging, group chats, file sharing, GIFs, and typing indicators. Stay connected with friends, see who's online, and enjoy seamless communication!" />
        <link rel="canonical" href={`${window.location.origin}`} />
    </Helmet>
    
    <div className="h-full w-full flex p-4 gap-x-6 bg-background">

            <div className={`flex-[.5] p-2 min-w-[15rem] bg-background max-md:fixed ${chatBar?"max-sm:right-0 left-0":"-left-72"} overflow-y-scroll  h-full z-10`}>
                
                {
                    !isChatsFetching && chats && loggedInUser ?

                    <ChatListWithSearch
                        chats={chats}
                        loggedInUserId={loggedInUser._id}
                        toggleChatBar={toggleChatBar}
                        updateSelectedChatId={updateSelectedChatId}
                        getChatAvatar={getChatAvatar}
                        getChatName={getChatName}
                    />
                    :
                    <ChatListWithSearchSkeleton/>
                }
                
            </div>

            <div className="flex-[1.6]">

                {
                    !isMessagesFetching && messages && selectedChatDetails && loggedInUser && chatName &&

                    <div className="flex flex-col gap-y-3 h-full">
  
                        <ChatHeader
                            isGroupChat={selectedChatDetails.isGroupChat}
                            chatName={chatName}
                            totalMembers={selectedChatDetails.members.length}
                            openRemoveMemberForm={openRemoveMemberForm}
                            toggleChatDetailsBar={toggleChatDetailsBar}
                        />

                        <div ref={messageContainerRef}  className="h-full flex flex-col gap-y-4 max-xl:gap-y-2 overflow-y-scroll">

                            <MessageList
                                isGroupChat={selectedChatDetails.isGroupChat} 
                                messages={messages} 
                                loggedInUserId={loggedInUser._id}
                            />
                            
                            <SeenByList members={selectedChatDetails.seenBy}/>

                            <TypingIndicatorWithUserList 
                             isGroupChat={selectedChatDetails.isGroupChat}
                             users={selectedChatDetails.userTyping}
                            />

                        </div>

                        <MessageForm toggleGif={toggleGif}/>  

                    </div>
                }
            </div>

            <div className={`flex-[.6] bg-background max-sm:w-full max-2xl:fixed ${!chatDetailsBar?"max-2xl:-right-[32rem]":""} ${chatDetailsBar?"max-2xl:right-0":""}  max-2xl:px-4 max-2xl:w-[25rem]`}>
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
            </div>
    </div>
    </>
  )
}
