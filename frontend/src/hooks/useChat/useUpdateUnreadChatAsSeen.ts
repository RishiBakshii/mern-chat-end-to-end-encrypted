import { useEffect } from "react"
import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IMessageSeenEventPayloadData } from "../../interfaces/messages"
import { useGetChatsQuery } from "../../services/api/chatApi"
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

export const useUpdateUnreadChatAsSeen = () => {

    const socket=getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    const {data:chatData} = useGetChatsQuery()
    
    useEffect(()=>{
        if(selectedChatId && chatData){

            const chat = chatData.find(chat=>chat._id===selectedChatId)

            if(chat && chat.unreadMessages.count > 0){

                const data:IMessageSeenEventPayloadData = {
                    chatId:selectedChatId                
                }
    
                socket?.emit(Events.MESSAGE_SEEN,data)

            }
        }
    },[selectedChatId,chatData])

}
