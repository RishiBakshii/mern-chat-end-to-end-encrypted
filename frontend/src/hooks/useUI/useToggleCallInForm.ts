import { selectCallInForm, setCallInForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleCallInForm = () => {

    const dispatch = useAppDispatch()
    const callInForm = useAppSelector(selectCallInForm)

    return ()=>{
        dispatch(setCallInForm(!callInForm))
    }
}
