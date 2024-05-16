import { IChatWithUnreadMessages } from "../../interfaces/chat";
import { selectLoggedInUser } from "../../services/redux/slices/authSlice";
import { useAppSelector } from "../../services/redux/store/hooks";

export const useGetChatAvatar = (selectedChatDetails:IChatWithUnreadMessages | null) => {

    const loggedInUser = useAppSelector(selectLoggedInUser)

    const avatar = selectedChatDetails?.isGroupChat?
                  selectedChatDetails.avatar:
                  selectedChatDetails?.members.filter(member=>member._id!==loggedInUser?._id)[0].avatar

    return avatar

}
