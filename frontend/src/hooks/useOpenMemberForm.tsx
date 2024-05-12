import { useAppDispatch  } from "../services/redux/store/hooks"
import { setMemberForm } from "../services/redux/slices/uiSlice"

export const useOpenMemberForm = () => {

    const dispatch = useAppDispatch()

    const openMemberForm = () => {
        dispatch(setMemberForm(true))
    }

    return openMemberForm
}
