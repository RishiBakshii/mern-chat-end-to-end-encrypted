import { useRef } from "react"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatList } from "../components/chat/ChatList"
import { MemberListWithNumber } from "../components/chat/MemberListWithNumber"
import { MessageForm } from "../components/chat/MessageForm"
import { SeenByList } from "../components/chat/SeenByList"
import { TypingIndicatorWithUserList } from "../components/chat/TypingIndicatorWithUserList"
import { MessageList } from "../components/messages/MessageList"
import { SearchInput } from "../components/ui/SearchInput"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useOpenMemberForm } from "../hooks/useUI/useOpenMemberForm"
import { useToggleGif } from "../hooks/useUI/useToggleGif"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useScrollToBottom } from "../hooks/useUtils/useScrollToBottom"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { useAppSelector } from "../services/redux/store/hooks"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
import { useMessageListener } from "../hooks/useEventListeners/useMessageListener"
import { useMessageSeenListener } from "../hooks/useEventListeners/useMessageSeenListener"
import { useNewGroupListener } from "../hooks/useEventListeners/useNewGroupListener"
import { useOfflineListener } from "../hooks/useEventListeners/useOfflineListener"
import { useOnlineListener } from "../hooks/useEventListeners/useOnlineListener"
import { useUnreadMessageListener } from "../hooks/useEventListeners/useUnreadMessageListener"
import { useTypingListener } from "../hooks/useEventListeners/useTypingListener"

export const ChatPage = () => {


   const {isChatsFetching,chats} = useFetchChats()
   
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
   
   useUpdateUnreadChatAsSeen(selectedChatDetails)
   
   const openMemberForm = useOpenMemberForm()
   const toggleGif = useToggleGif()
   const chatName = useGetChatName(selectedChatDetails)


  return (
    <div className="h-full w-full flex p-6 gap-x-6">

            <div className="flex-[.5]">
                {
                    !isChatsFetching && chats && 

                    <div className="flex flex-col gap-y-5">
                        <SearchInput/>
                        <ChatList chats={chats} updateSelectedChatId={updateSelectedChatId}/>
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

            <div className="flex-[.8]">
                {
                    !isChatsFetching && chats && loggedInUser && selectedChatDetails &&

                    <MemberListWithNumber 
                        members={selectedChatDetails.members}
                        chatAdminId={selectedChatDetails.admin}
                        loggedInUserId={loggedInUser._id}
                    />
                }
            </div>
    </div>
  )
}
