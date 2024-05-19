import { Theme } from "../../interfaces/theme"
import { setDarkMode } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"


export const useUpdateTheme = () => {

    const dispatch = useAppDispatch()
    
    return (theme:Theme)=>{
        localStorage.setItem("theme",theme)
        document.body.classList.remove('dark','light')
        document.body.classList.add(theme)
        dispatch(setDarkMode(theme==='dark'?true:false))
    }

}
