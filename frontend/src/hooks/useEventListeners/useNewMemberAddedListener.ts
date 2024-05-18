import { Events } from "../../enums/events"
import { INewMemberAddedEventPayloadData } from "../../interfaces/chat";
import { chatApi } from "../../services/api/chatApi";
import { selectSelectedChatDetails, updateSelectedChatMembers } from "../../services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useNewMemberAddedListener = () => {

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const dispatch = useAppDispatch()

    useSocketEvent(Events.NEW_MEMBER_ADDED,({chatId,members}:INewMemberAddedEventPayloadData)=>{

        const isMemberAddedInSelectedChat:boolean = chatId===selectedChatDetails?._id

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

                const chat = draft.find(draft=>draft._id===chatId)

                if(chat){

                    if(isMemberAddedInSelectedChat){
                        dispatch(updateSelectedChatMembers(members))
                    }

                    chat.members.push(...members)
                }
            })
        )

    })
}
