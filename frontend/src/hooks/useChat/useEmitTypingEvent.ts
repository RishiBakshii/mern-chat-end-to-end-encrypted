import { useEffect } from "react"
import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IUserTypingEventPayloadData } from "../../interfaces/messages"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"

export const useEmitTypingEvent = (isTyping:string) => {
    
    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useEffect(()=>{

        if(selectedChatDetails && isTyping){

            const data:IUserTypingEventPayloadData = 
            {
                chatId:selectedChatDetails._id,
                members:selectedChatDetails.members.map(member=>member._id)
            }

            socket?.emit(Events.USER_TYPING,data)
        }

    },[selectedChatDetails,isTyping])
}
