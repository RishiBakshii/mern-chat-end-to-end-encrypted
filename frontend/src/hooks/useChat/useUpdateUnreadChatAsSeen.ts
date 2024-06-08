import { useEffect } from "react"
import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IMessageSeenEventPayloadData } from "../../interfaces/messages"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

export const useUpdateUnreadChatAsSeen = () => {

    const socket=getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    
    useEffect(()=>{
        if(selectedChatDetails && selectedChatDetails.unreadMessages.count > 0){
            console.log('asd');

            const data:IMessageSeenEventPayloadData = 
            {
                chatId:selectedChatDetails._id
            }

            socket?.emit(Events.MESSAGE_SEEN,data)
            console.log('message seen event emitted');
        }
    },[selectedChatDetails])

}
