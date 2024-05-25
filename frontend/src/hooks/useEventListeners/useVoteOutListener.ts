import { Events } from "../../enums/events";
import { IVoteOutEventReceiveData } from "../../interfaces/messages";
import { messageApi } from "../../services/api/messageApi";
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useVoteOutListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    
    useSocketEvent(Events.VOTE_OUT,({_id,optionIndex,user}:IVoteOutEventReceiveData)=>{
        console.log('vote out event data',{_id,optionIndex,user});

        if(selectedChatId){

            dispatch(
                messageApi.util.updateQueryData("getMessagesByChatId",selectedChatId,(draft)=>{

                    const message = draft.find(draft=>draft._id===_id)
                    
                    if(message && message.isPoll && message.pollOptions){
                        const voteToBeRemovedIndex = message.pollOptions[optionIndex].votes.findIndex(({_id})=>_id===user._id)
                        message.pollOptions[optionIndex].votes.splice(voteToBeRemovedIndex,1)
                    }
    
                })
            )

        }

    })
}
