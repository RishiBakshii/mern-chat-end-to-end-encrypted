import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"

export const useDeleteReaction = () => {

    const socket = getSocket()

    const deleteReaction = ({chatId,messageId}:{chatId:string,messageId:string})=>{
        socket?.emit(Events.DELETE_REACTION,{chatId,messageId})
    }

    return {
        deleteReaction
    }
}
