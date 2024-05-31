import toast from "react-hot-toast"
import { useSendCallInRequest } from "../../hooks/useCallIn/useSendCallInRequest"
import { useGetChatAvatar } from "../../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../../hooks/useUtils/useGetChatName"
import { useGetFriendsQuery } from "../../services/api/friendApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { CallInFriendList } from "./CallInFriendList"

export const CallInForm = () => {

  const {data:friends} = useGetFriendsQuery()

  const sendCallInRequest = useSendCallInRequest()
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id
  
  const getChatName = useGetChatName()
  const getChatAvatar = useGetChatAvatar()

  const handleSendCallInRequest = (callee:string)=>{

    const chatName = getChatName(selectedChatDetails,loggedInUserId)
    const chatAvatar = getChatAvatar(selectedChatDetails,loggedInUserId)

    if(selectedChatDetails && loggedInUserId && chatName && chatAvatar){

      sendCallInRequest({
        chat:{
          avatar:chatAvatar,
          chatId:selectedChatDetails._id,
          chatName:chatName,
        },
        callee,
      })
      
      toast.success("Call-in request sent")
    }

  }

  return (
    <div className="flex flex-col gap-y-6">

      <h4 className="font-medium text-xl">Call in any of your online friend in this chat</h4>

      {
        friends && loggedInUserId &&
        <CallInFriendList  
           friends={friends.filter(friend=>friend.isActive)}
           sendCallInRequest={handleSendCallInRequest}
        />
      }

    </div>
  )
}
