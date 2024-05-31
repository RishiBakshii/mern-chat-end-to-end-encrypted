import toast from "react-hot-toast"
import { Events } from "../../enums/events"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { ICallInRejectEventReceiveData } from "../../interfaces/callIn"

export const useCallInRejectListener = () => {

    useSocketEvent(Events.CALL_IN_REJECT,({callee}:ICallInRejectEventReceiveData)=>{
        toast(`${callee.username} has rejected your call-in request`)
    })
}
