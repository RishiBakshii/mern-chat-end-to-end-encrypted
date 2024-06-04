import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"

export const useDeleteMessage = () => {

    const socket = getSocket()

    return ({messageId}:{messageId:string})=>{
        socket?.emit(Events.MESSAGE_DELETE,{messageId})
    }
}
