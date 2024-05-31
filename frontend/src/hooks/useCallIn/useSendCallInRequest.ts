import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { ICallInRequestEventPayloadData } from "../../interfaces/callIn"

export const useSendCallInRequest = () => {

    const socket = getSocket()


    return ({chat,callee}:ICallInRequestEventPayloadData)=>{
    
        socket?.emit(Events.CALL_IN_REQUEST,{chat,callee})
    }
}
