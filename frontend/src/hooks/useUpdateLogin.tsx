import { useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import type { IUser } from "../interfaces/auth"
import { updateLoggedInUser } from "../features/auth/authSlice"

export const useUpdateLogin = (isSuccess:boolean,data:IUser | null | undefined) => {

    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(isSuccess && data){
            dispatch(updateLoggedInUser(data))
        }
    },[isSuccess])

}
