import { IUser } from "../../interfaces/auth";
import { IChatWithUnreadMessages } from "../../interfaces/chat";

export const useGetChatAvatar = (selectedChatDetails:IChatWithUnreadMessages | null,loggedInUserId:IUser['_id'] | null | undefined) => {


    const avatar = selectedChatDetails?.isGroupChat?
                  selectedChatDetails.avatar:
                  selectedChatDetails?.members.filter(member=>member._id!==loggedInUserId)[0].avatar

    return avatar

}
