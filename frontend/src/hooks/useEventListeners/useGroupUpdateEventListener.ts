import { Events } from "../../enums/events"
import { chatApi } from "../../services/api/chatApi"
import { selectSelectedChatId, updateChatNameOrAvatar } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useGroupUpdateEventListener = () => {

    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    useSocketEvent(Events.GROUP_UPDATE,({_id,name,avatar}:{_id:string,name?:string,avatar?:string})=>{
        
        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

                const chat = draft.find(draft=>draft._id===_id)

                if(chat){

                    if(chat._id === selectedChatId){
                        dispatch(updateChatNameOrAvatar({name,avatar}))
                    }

                    if(name) chat.name = name
                    if(avatar) chat.avatar = avatar
                }
            })
        )
    })
}
