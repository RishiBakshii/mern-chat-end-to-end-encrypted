import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"


export const useGetChatName = (selectedChatDetails:IChatWithUnreadMessages | null) => {

    const loggedInUserId = useAppSelector(selectLoggedInUser)

    const name = selectedChatDetails?.isGroupChat?
                 selectedChatDetails?.name:
                 selectedChatDetails?.members.filter(member=>member._id!==loggedInUserId?._id)[0].username

    return name
}
