import { selectChatBar, setChatBar } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleChatBar = () => {

    const dispatch = useAppDispatch()
    const chatBar = useAppSelector(selectChatBar)

    return ()=>{
        dispatch(setChatBar(!chatBar))
    }
}
