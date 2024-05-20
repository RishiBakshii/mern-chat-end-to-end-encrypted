import { setRemoveMemberForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useOpenRemoveMemberForm = () => {

    const dispatch = useAppDispatch()

    return ()=>{
        dispatch(setRemoveMemberForm(true))
    }
}
