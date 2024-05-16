import { useEffect } from "react"
import type { IUser } from "../../interfaces/auth"
import { updateLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useUpdateLogin = (isSuccess:boolean,data:IUser | null | undefined) => {

    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(isSuccess && data){
            dispatch(updateLoggedInUser(data))
        }
    },[isSuccess])

}
