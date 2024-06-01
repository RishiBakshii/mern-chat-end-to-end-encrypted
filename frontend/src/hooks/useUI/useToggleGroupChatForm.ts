import { selectGroupChatForm, setNavMenu, setNewgroupChatForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleGroupChatForm = () => {

    const dispatch = useAppDispatch()
    const groupChatForm = useAppSelector(selectGroupChatForm)

    return ()=>{
        
        dispatch(setNavMenu(false))
        dispatch(setNewgroupChatForm(!groupChatForm))
    }
}
