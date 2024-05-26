import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useClearAdditionalMessagesOnChatChange = () => {

    const dispatch = useAppDispatch()

    return (chatId:string) => {

        dispatch(
            messageApi.util.updateQueryData("getMessagesByChatId",{_id:chatId,page:5},(draft)=>{
                draft.messages = draft.messages.slice(0,20)
            })
        )
    }

}
