import toast from "react-hot-toast"
import { Events } from "../../enums/events"
import { ICallOutEventReceiveData } from "../../interfaces/callIn"
import { removeJoinedChat } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"


export const useCallOutListener = () => {

    const dispatch = useAppDispatch()
    const loggedInUser = useAppSelector(selectLoggedInUser)
    
    useSocketEvent(Events.CALL_OUT,({caller,callee,chat}:ICallOutEventReceiveData)=>{

        if(loggedInUser?._id===callee._id){
            dispatch(removeJoinedChat({chatId:chat.chatId}))
        }

        toast.success(`${caller.username} has removed ${callee.username} from chat ${chat.name}`)
    })
}
