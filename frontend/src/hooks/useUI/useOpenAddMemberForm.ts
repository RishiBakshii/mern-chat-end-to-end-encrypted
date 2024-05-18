import { setAddMemberForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useOpenAddMemberForm = () => {

    const dispatch = useAppDispatch()

    return ()=>{
        dispatch(setAddMemberForm(true))
    }
}
