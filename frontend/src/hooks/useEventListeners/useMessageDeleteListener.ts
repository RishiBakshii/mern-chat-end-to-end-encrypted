import { Events } from "../../enums/events"
import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageDeleteListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Events.MESSAGE_DELETE,({messageId,chatId}:{messageId:string,chatId:string})=>{
        dispatch(
            messageApi.util.updateQueryData("getMessagesByChatId",{_id:chatId,page:1},(draft)=>{
                draft.messages = draft.messages.filter(message=>message._id!==messageId)
            })
        )
    })
}
