import { Events } from "../../enums/events"
import { IVoteInEventReceiveData } from "../../interfaces/messages";
import { messageApi } from "../../services/api/messageApi";
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useVoteInListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    
    useSocketEvent(Events.VOTE_IN,({_id,optionIndex,user}:IVoteInEventReceiveData)=>{

        if(selectedChatId){

            dispatch(
                messageApi.util.updateQueryData("getMessagesByChatId",{_id:selectedChatId,page:1},(draft)=>{
    
                    const message = draft.messages.find(draft=>draft._id===_id)
                    if(message && message.isPoll && message.pollOptions){
                        message.pollOptions[optionIndex].votes.push(user)
                    }
    
                })
            )
        }

    })
}
