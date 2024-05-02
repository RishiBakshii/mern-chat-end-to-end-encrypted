import { useEffect } from "react"
import { useAppSelector } from "../app/hooks"
import { selectSelectedChatId } from "../features/chat/chatSlice"
import { getSocket } from "../context/socket"
import { Events } from "../enums/events"
import { useGetChatsQuery } from "../features/chat/api"
import { IMessageSeenEventPayloadData } from "../interfaces/messages"

export const useUpdateUnreadMessage = () => {

    const socket=getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const {data:chats}= useGetChatsQuery()

    useEffect(()=>{
        if(selectedChatId){

            const chatData = chats?.find(chat=>chat._id===selectedChatId)

            if(chatData && chatData.unreadMessages.count>0){

                const data:IMessageSeenEventPayloadData = {
                    chatId:selectedChatId,
                    members:chatData.members.map(member=>member._id)
                }
                socket?.emit(Events.MESSAGE_SEEN,data)
            }
        }
    },[selectedChatId])

}
