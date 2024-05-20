import { Events } from "../../enums/events"
import { IDeleteChatEventReceiveData } from "../../interfaces/chat"
import { chatApi } from "../../services/api/chatApi"
import { selectSelectedChatId, updateSelectedChatDetails, updateSelectedChatId } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useDeleteChatListener = () => {

    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    useSocketEvent(Events.DELETE_CHAT,({chatId}:IDeleteChatEventReceiveData)=>{

        const isremovedFromSelectedChat = selectedChatId === chatId

        if(isremovedFromSelectedChat){
            dispatch(updateSelectedChatId(null))
            dispatch(updateSelectedChatDetails(null))
        }

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const deletedChat = draft.findIndex(draft=>draft._id===chatId)
                draft.splice(deletedChat,1)
            })
        )
    })
}
