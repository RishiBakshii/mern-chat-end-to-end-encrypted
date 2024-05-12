import { useEffect } from "react"
import { useAppSelector } from "../services/redux/store/hooks"
import { getSocket } from "../context/socket"
import { Events } from "../enums/events"
import { selectSelectedChatDetails, selectSelectedChatId } from "../services/redux/slices/chatSlice"
import { IMessageSeenEventPayloadData } from "../interfaces/messages"

export const useUpdateUnreadMessage = () => {

    const socket=getSocket()

    const selectedChatId = useAppSelector(selectSelectedChatId)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useEffect(()=>{
        if(selectedChatId && selectedChatDetails){

            if(selectedChatDetails?.unreadMessages.count > 0){

                const data:IMessageSeenEventPayloadData = {
                    chatId:selectedChatId,
                    members:selectedChatDetails.members.map(member=>member._id.toString())
                }
                socket?.emit(Events.MESSAGE_SEEN,data)
            }
        }
    },[selectedChatId,selectedChatDetails])

}
