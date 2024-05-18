import { useLazyLogoutQuery } from "../../services/api/authApi"
import { logout } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useLogout = () => {

    const dispatch = useAppDispatch()
    const [logoutTrigger,{}]  = useLazyLogoutQuery()

    return ()=>{
        logoutTrigger()
        dispatch(logout())
    }
}
