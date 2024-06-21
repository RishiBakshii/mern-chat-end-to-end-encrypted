import { Events } from "../../enums/events"
import { IDeleteReactionEventReceiveData } from "../../interfaces/messages"
import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useDeleteReactionListener = () => {
    
    const dispatch = useAppDispatch()

    useSocketEvent(Events.DELETE_REACTION,({chatId,messageId,userId}:IDeleteReactionEventReceiveData)=>{

        dispatch(

            messageApi.util.updateQueryData("getMessagesByChatId",{_id:chatId,page:1},(draft)=>{
    
                const message = draft.messages.find(draft=>draft._id === messageId)
    
                if(message && message?.reactions?.length) {
                    const reactionToBeRemovedIndex = message.reactions.findIndex(reaction=>reaction.user._id === userId)
    
                    if(reactionToBeRemovedIndex!== -1) message.reactions.splice(reactionToBeRemovedIndex,1)
                    
                } 
            })
        )
    })
}
