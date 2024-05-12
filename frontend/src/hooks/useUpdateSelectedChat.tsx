import { updateSelectedChatId } from "../services/redux/slices/chatSlice"
import { useAppDispatch } from "../services/redux/store/hooks"

export const useUpdateSelectedChat = () => {

    const dispatch = useAppDispatch()
    
    return (chatId:string) =>{
        dispatch(updateSelectedChatId(chatId))
    }

}
