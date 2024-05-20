import { Events } from "../../enums/events"
import { IMemberRemovedEventReceiveData } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { removeSelectedChatMembers, selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMemberRemovedListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useSocketEvent(Events.MEMBER_REMOVED,({chatId,membersId}:IMemberRemovedEventReceiveData)=>{
        
        const isMemberRemovedFromSelectedChatId = selectedChatDetails?._id === chatId

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

                const chat = draft.find(draft=>draft._id===chatId)

                if(chat){

                    chat.members.filter(member=>!membersId.includes(member._id.toString()))

                    if(isMemberRemovedFromSelectedChatId){
                        dispatch(removeSelectedChatMembers(membersId))
                    }
                }

            })
        )
    })
}
