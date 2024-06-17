import { messageApi } from "../../services/api/messageApi"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useClearAdditionalMessagesOnChatChange = () => {

    const dispatch = useAppDispatch()

    const clearExtraPreviousMessages = (chatId:string) => {

        dispatch(
            messageApi.util.updateQueryData("getMessagesByChatId",{_id:chatId,page:1},(draft)=>{

                let messagesToKeep = []

                const newMessages = draft.messages.filter(message=>message?.isNew)

                if(newMessages.length > 20){
                    messagesToKeep = draft.messages.slice(-20)
                }
                else{
                    const difference = 20 - newMessages.length
                    messagesToKeep = [...draft.messages.slice(0,difference),...newMessages]
                }
                draft.messages = messagesToKeep
            })
        )
    }

    return {
        clearExtraPreviousMessages
    }

}
