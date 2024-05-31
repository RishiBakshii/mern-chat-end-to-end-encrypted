import toast from "react-hot-toast"
import { Events } from "../../enums/events"
import { ICallInRequestEventReceiveData } from "../../interfaces/callIn"
import { setCallInRequests } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useCallInRequestListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.CALL_IN_REQUEST,({caller,chat}:ICallInRequestEventReceiveData)=>{
        toast(`${caller.username} sent you a call-in request`)
        dispatch(setCallInRequests({caller,chat}))
    })
}
