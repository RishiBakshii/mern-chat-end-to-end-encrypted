import { Events } from "../../enums/events"
import { INewReactionEventReceiveData } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useNewReactionListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_REACTION,({user,emoji,chatId,messageId}:INewReactionEventReceiveData)=>{

        dispatch(

            messageApi.util.updateQueryData("getMessagesByChatId",{_id:chatId,page:1},(draft)=>{
    
                const message = draft.messages.find(draft=>draft._id === messageId)
    
                if(message) {
                     message.reactions.push({user,emoji})
                }
                
            })
        )

    })

}
