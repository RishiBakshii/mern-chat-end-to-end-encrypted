import { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"


export const useGetChatName = (selectedChatDetails:IChatWithUnreadMessages | null,loggedInUserId:IUser['_id'] | undefined | null) => {


    const name = selectedChatDetails?.isGroupChat?
                 selectedChatDetails?.name:
                 selectedChatDetails?.members.filter(member=>member._id!==loggedInUserId)[0].username

    return name
}
