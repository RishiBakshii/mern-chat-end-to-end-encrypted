import { selectRecoverPrivateKeyForm, setRecoverPrivateKeyForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleRecoverPrivateKeyForm = () => {

    const dispatch = useAppDispatch()
    const recoverPrivateKeyForm = useAppSelector(selectRecoverPrivateKeyForm)

    return ()=>{
        dispatch(setRecoverPrivateKeyForm(!recoverPrivateKeyForm))
    }
}
