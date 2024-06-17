import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { setNotificationPermissionForm } from "../../services/redux/slices/uiSlice"

export const useCheckFcmTokenExists = () => {

    const dispatch = useAppDispatch()
    const loggedInUser = useAppSelector(selectLoggedInUser)

    useEffect(()=>{
        if(loggedInUser && !loggedInUser.fcmTokenExists) dispatch(setNotificationPermissionForm(true))
    },[loggedInUser])
  
}
