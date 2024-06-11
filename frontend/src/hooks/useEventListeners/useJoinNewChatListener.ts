import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useJoinNewChatListener = () => {

    const socket = getSocket()

    useSocketEvent(Events.JOIN_NEW_CHAT,(chatId:string)=>{
        socket?.emit(Events.JOIN_NEW_CHAT,chatId)
    })
}
