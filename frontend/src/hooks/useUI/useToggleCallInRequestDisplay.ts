import { selectCallInRequestDisplay, setCallInRequestDisplay } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleCallInRequestDisplay = () => {

    const dispatch = useAppDispatch()
    const callInForm = useAppSelector(selectCallInRequestDisplay)

    return ()=>{
        dispatch(setCallInRequestDisplay(!callInForm))
    }
}
