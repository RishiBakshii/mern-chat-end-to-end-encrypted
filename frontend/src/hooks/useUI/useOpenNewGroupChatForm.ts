import { setNavMenu, setNewgroupChatForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useOpenNewGroupChatForm = () => {

    const dispatch = useAppDispatch()

    return ()=>{
        
        dispatch(setNavMenu(false))
        dispatch(setNewgroupChatForm(true))
    }
}
