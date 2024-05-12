import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MemberListWithNumber } from "../components/chat/MemberListWithNumber"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../services/redux/slices/chatSlice"
import { useChatHandling } from "../hooks/useChatHandling"
import { useFriendRequest } from "../hooks/useFriendRequest"
import { useMessageHandler } from "../hooks/useMessageHandler"
import { useMessageSeen } from "../hooks/useMessageSeen"
import { useNewGroup } from "../hooks/useNewGroup"
import { useOffline } from "../hooks/useOffline"
import { useOnline } from "../hooks/useOnline"
import { useOpenMemberForm } from "../hooks/useOpenMemberForm"
import { useToast } from "../hooks/useToast"
import { useTyping } from "../hooks/useTyping"
import { useUnreadMessageHandler } from "../hooks/useUnreadMessageHandler"
import { useUpdateUnreadMessage } from "../hooks/useUpdateUnreadMessage"
import { useAppSelector } from "../services/redux/store/hooks"
import { useGetChatsQuery } from "../services/api/chatApi"
import { ChatHeader } from "../components/chat/ChatHeader"
import { MessageList } from "../components/messages/MessageList"
import { MessageForm } from "../components/chat/MessageForm"
import { useGetChatName } from "../hooks/useGetChatName"
import { useRef } from "react"
import { useScrollToBottom } from "../hooks/useScrollToBottom"
import { useToggleGif } from "../hooks/useToggleGif"

export const ChatPage = () => {

   const messageContainerRef = useRef<HTMLDivElement>(null)

   const {isError,isFetching,isSuccess,isUninitialized,error,data:chats} = useGetChatsQuery()
   useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

   const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
   const loggedInUser = useAppSelector(selectLoggedInUser)

   const [isMessagesFetching,messages] =  useChatHandling()

    useScrollToBottom(messageContainerRef,messages)

    useMessageHandler()
    useUnreadMessageHandler()
    useMessageSeen()
    useNewGroup()
    useOnline()
    useOffline()
    useFriendRequest()
    const isTyping = useTyping()
    useUpdateUnreadMessage()

    const openMemberForm = useOpenMemberForm()

    const toggleGif = useToggleGif()

    const chatName = useGetChatName(selectedChatDetails,loggedInUser?._id)

  return (
    <div className="h-full w-full flex p-6 gap-x-6">

            <div className="flex-[.5]">
                {
                    !isFetching && chats && 
                    <ChatListWithSearch 
                      chats={chats}
                    />
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

                        </div>

                        <MessageForm toggleGif={toggleGif}/>  

                    </div>
                }
            </div>

            <div className="flex-[.8]">
                {
                    !isFetching && chats && loggedInUser && selectedChatDetails &&

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
