import { selectCallOutForm, setCallOutForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleCallOutForm = () => {

    const dispatch = useAppDispatch()
    const callOutForm = useAppSelector(selectCallOutForm)

    return ()=>{
        dispatch(setCallOutForm(!callOutForm))
    }
}
