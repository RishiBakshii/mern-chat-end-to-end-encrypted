import { selectNavMenu, setNavMenu } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleNavMenu = () => {

    const dispatch = useAppDispatch()
    const isNavMenuOpen = useAppSelector(selectNavMenu)

    return ()=>{
        dispatch(setNavMenu(!isNavMenuOpen))
    }
}
