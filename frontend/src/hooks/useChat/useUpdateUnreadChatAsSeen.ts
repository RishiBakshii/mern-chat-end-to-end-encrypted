import { useEffect } from "react"
import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessageSeenEventPayloadData } from "../../interfaces/messages"

export const useUpdateUnreadChatAsSeen = (selectedChatDetails:IChatWithUnreadMessages | null) => {

    const socket=getSocket()

    useEffect(()=>{
        if(selectedChatDetails && selectedChatDetails.unreadMessages.count > 0){

            const data:IMessageSeenEventPayloadData = 
            {
                chatId:selectedChatDetails._id
            }

            socket?.emit(Events.MESSAGE_SEEN,data)
            
        }
    },[selectedChatDetails])

}
