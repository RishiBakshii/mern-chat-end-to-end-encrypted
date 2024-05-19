import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IEditMessageEventPayloadData } from "../../interfaces/messages"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

export const useEditMessage = () => {

    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    return (messageId:string,updatedContent:string)=>{
    
        if(selectedChatDetails){
    
            const payload:IEditMessageEventPayloadData = {
                memberIds:selectedChatDetails.members.map(member=>member._id),
                messageId:messageId,
                updatedContent,
            }
        
            socket?.emit(Events.MESSAGE_EDIT,payload)
        }
    
      }
}
