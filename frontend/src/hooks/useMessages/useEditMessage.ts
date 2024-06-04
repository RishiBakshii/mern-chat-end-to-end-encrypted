import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IEditMessageEventPayloadData } from "../../interfaces/messages"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { encryptMessage } from "../../utils/encryption"
import { useGetSharedKey } from "../useAuth/useGetSharedKey"

export const useEditMessage = () => {

    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id

    const getSharedKey = useGetSharedKey()

    return async(messageId:string,updatedContent:string)=>{
    
        if(selectedChatDetails && loggedInUserId){

            let encryptedMessage;

            if(!selectedChatDetails.isGroupChat){
                const otherMember = selectedChatDetails.members.filter(member=>member._id !== loggedInUserId)[0]

                const sharedKey =  await getSharedKey(loggedInUserId,otherMember)

                if(sharedKey){
                   encryptedMessage = await encryptMessage(sharedKey,updatedContent)
                }
            }

            const payload:IEditMessageEventPayloadData = {
                chatId:selectedChatDetails._id,
                messageId:messageId,
                updatedContent:encryptedMessage?encryptedMessage:updatedContent,
            }
        
            socket?.emit(Events.MESSAGE_EDIT,payload)
        }
    
      }
}
