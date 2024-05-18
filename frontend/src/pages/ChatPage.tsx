import { useRef } from "react"
import { ChatDetails } from "../components/chat/ChatDetails"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatList } from "../components/chat/ChatList"
import { MessageForm } from "../components/chat/MessageForm"
import { SeenByList } from "../components/chat/SeenByList"
import { TypingIndicatorWithUserList } from "../components/chat/TypingIndicatorWithUserList"
import { MessageList } from "../components/messages/MessageList"
import { SearchInput } from "../components/ui/SearchInput"
import { ChatListSkeleton } from "../components/ui/skeleton/ChatListSkeleton"
import { SearchInputSkeleton } from "../components/ui/skeleton/SearchInputSkeleton"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
import { useMessageListener } from "../hooks/useEventListeners/useMessageListener"
import { useNewGroupListener } from "../hooks/useEventListeners/useNewGroupListener"
import { useOfflineListener } from "../hooks/useEventListeners/useOfflineListener"
import { useOnlineListener } from "../hooks/useEventListeners/useOnlineListener"
import { useTypingListener } from "../hooks/useEventListeners/useTypingListener"
import { useUnreadMessageListener } from "../hooks/useEventListeners/useUnreadMessageListener"
import { useFetchFriends } from "../hooks/useFriend/useFetchFriends"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useOpenMemberForm } from "../hooks/useUI/useOpenMemberForm"
import { useToggleGif } from "../hooks/useUI/useToggleGif"
import { useGetChatAvatar } from "../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useScrollToBottom } from "../hooks/useUtils/useScrollToBottom"
import { useFetchFriendRequest } from "../hooks/userRequest/useFetchFriendRequest"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { useAppSelector } from "../services/redux/store/hooks"
import { useNewMemberAddedListener } from "../hooks/useEventListeners/useNewMemberAddedListener"

export const ChatPage = () => {


   const {isChatsFetching,chats} = useFetchChats()
   useFetchFriends()
   useFetchFriendRequest()
   
   const loggedInUser = useAppSelector(selectLoggedInUser)
   const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
   const messageContainerRef = useRef<HTMLDivElement>(null)
   
   const {isMessagesFetching,messages} = useFetchMessages(selectedChatDetails?._id)


   
   const updateSelectedChatId = useUpdateChatSelection()
   
   useScrollToBottom(messageContainerRef,[messages,selectedChatDetails],0)
   
   // listeners
   useFriendRequestListener()
   useMessageListener()
//    useMessageSeenListener()
   useNewGroupListener()
   useUnreadMessageListener()
   useOfflineListener()
   useOnlineListener()
   useTypingListener()
   useNewMemberAddedListener()
   
   useUpdateUnreadChatAsSeen(selectedChatDetails)
   
   const openMemberForm = useOpenMemberForm()
   const toggleGif = useToggleGif()

   const chatName = useGetChatName(selectedChatDetails,loggedInUser?._id)
   const chatAvatar= useGetChatAvatar(selectedChatDetails,loggedInUser?._id)


  return (
    <div className="h-full w-full flex p-6 gap-x-6">

            <div className="flex-[.5]">
                {
                    <div className="flex flex-col gap-y-5">
                        {
                            !isChatsFetching && chats ?
                            <>
                                <SearchInput/>
                                <ChatList chats={chats} updateSelectedChatId={updateSelectedChatId}/>
                            </>
                            :
                            <>
                                <SearchInputSkeleton/>
                                <ChatListSkeleton/>
                            </>
                        }
                    </div>
                }
            </div>

            <div className="flex-[1.6]">

                {
                    !isMessagesFetching && messages && selectedChatDetails && loggedInUser && chatName &&

                    <div className="flex flex-col gap-y-3 h-full">
  
                        <ChatHeader
                            chatName={chatName}
                            openMemberForm={openMemberForm}
                            totalMembers={selectedChatDetails.members.length}
                        />

                        <div ref={messageContainerRef}  className="h-full flex px-2 flex-col gap-y-4 overflow-y-scroll">

                            <MessageList
                                isGroupChat={selectedChatDetails.isGroupChat} 
                                messages={messages} 
                                loggedInUserId={loggedInUser._id}
                            />
                            
                            <SeenByList members={selectedChatDetails.seenBy}/>

                            <TypingIndicatorWithUserList users={selectedChatDetails.userTyping}/>

                        </div>

                        <MessageForm toggleGif={toggleGif}/>  

                    </div>
                }
            </div>

            <div className="flex-[.6]">
                {
                    !isChatsFetching && chats && loggedInUser && selectedChatDetails && chatName && chatAvatar &&

                    <ChatDetails
                      isGroupChat={selectedChatDetails.isGroupChat}
                      chatName={chatName}
                      chatAvatar={chatAvatar}
                      members={selectedChatDetails.members}
                    />
                }
            </div>
    </div>
  )
}
