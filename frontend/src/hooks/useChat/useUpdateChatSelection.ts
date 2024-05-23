import { useGetChatsQuery } from "../../services/api/chatApi"
import { selectSelectedChatId, updateSelectedChatDetails, updateSelectedChatId } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useUpdateChatSelection = () => {

    const dispatch = useAppDispatch()
    const selectedChatId = useAppSelector(selectSelectedChatId)

    const {data:chats} = useGetChatsQuery()
    
    return (chatId:string) =>{

        if(chatId!==selectedChatId){

            dispatch(updateSelectedChatId(chatId))
    
            const chatDetails = chats?.find(chat=>chat._id===chatId)
    
            if(chatDetails) {
                dispatch(updateSelectedChatDetails(chatDetails))
            }
        }


    }

}
