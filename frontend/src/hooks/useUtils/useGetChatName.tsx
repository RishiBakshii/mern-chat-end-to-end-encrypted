import { IUser } from "../../interfaces/auth"
import { IChatWithUnreadMessages } from "../../interfaces/chat"


export const useGetChatName = () => {

    return (selectedChatDetails:IChatWithUnreadMessages | null,loggedInUserId:IUser['_id'] | undefined | null)=>{

        return  selectedChatDetails?.isGroupChat? selectedChatDetails?.name:selectedChatDetails?.members.filter(member=>member._id!==loggedInUserId)[0].username
    }
}
