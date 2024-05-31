import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { ICallOutEventPayloadData } from "../../interfaces/callIn"

export const useCallOut = () => {

    const socket = getSocket()

    return (payload:ICallOutEventPayloadData)=>{
        socket?.emit(Events.CALL_OUT,payload)
    }
}
