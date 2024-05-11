import { useAppSelector } from "../app/hooks"
import { ChatArea } from "../components/chat/ChatArea"
import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MemberListWithNumber } from "../components/chat/MemberListWithNumber"
import { selectLoggedInUser } from "../features/auth/authSlice"
import { useGetChatsQuery } from "../features/chat/api"
import { selectSelectedChatDetails } from "../features/chat/chatSlice"
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

export const ChatPage = () => {


   const {isError,isFetching,isSuccess,isUninitialized,error,data:chats} = useGetChatsQuery()
   useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

   const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
   const loggedInUser = useAppSelector(selectLoggedInUser)

   const [isMessagesFetching,messages] =  useChatHandling()

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

  return (
    <div className="h-full w-full flex ">

            <div className="flex-[.5] p-6 flex flex-col gap-y-4">
                {
                    !isFetching && chats && 

                    <ChatListWithSearch 
                      chats={chats}
                    />
                }
            </div>

            <div className="flex-[1.6] p-6 flex flex-col justify-between gap-y-4">

                {
                    !isMessagesFetching && messages && selectedChatDetails && loggedInUser && 

                    <ChatArea
                        openMemberForm={openMemberForm}
                        isTyping={isTyping}
                        members={selectedChatDetails.members}
                        isGroupChat={selectedChatDetails?.isGroupChat}
                        loggedInUserId={loggedInUser?._id}
                        messages={messages}
                        chatName={selectedChatDetails.name}
                    />
                }
            </div>

            <div className="flex-[.8] flex flex-col justify-between p-6">
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
