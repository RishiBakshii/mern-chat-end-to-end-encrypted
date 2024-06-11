import { selectSettingsForm, setNavMenu, setSettingsForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleSettingsForm = () => {

    const dispatch = useAppDispatch()

    const settingsForm = useAppSelector(selectSettingsForm)

    return ()=>{
        dispatch(setNavMenu(false))
        dispatch(setSettingsForm(!settingsForm))
    }
}
