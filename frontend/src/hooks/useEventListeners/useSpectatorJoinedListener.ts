import toast from "react-hot-toast"
import { Events } from "../../enums/events"
import { ISpectator } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { selectSelectedChatId, updateSpectators } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useSpectatorJoinedListener = () => {

    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    useSocketEvent(Events.SPECTATOR_JOINED,(spectator:ISpectator)=>{

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                
                const chat = draft.find(draft=>draft._id===spectator.chatId)

                
                if(chat){
                    
                    if(chat._id === selectedChatId){
                        dispatch(updateSpectators(spectator))
                    }
                    chat.spectators.push(spectator)
                }
                toast.success(`${spectator.username} has joined as a spectator`)
            })
        )
        

    })
}
