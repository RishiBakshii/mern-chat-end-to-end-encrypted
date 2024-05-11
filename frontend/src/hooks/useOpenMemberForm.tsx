import { useAppDispatch } from "../app/hooks"
import { setMemberForm } from "../features/ui/uiSlice"

export const useOpenMemberForm = () => {

    const dispatch = useAppDispatch()

    const openMemberForm = () => {
        dispatch(setMemberForm(true))
    }

    return openMemberForm
}
