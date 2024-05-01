import { useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import type { IUser } from "../interfaces/auth"
import { updateLoggedInUser } from "../features/auth/authSlice"
import { useLazyGetChatsQuery } from "../features/chat/api"

export const useUpdateLogin = (isSuccess:boolean,data:IUser | null | undefined) => {

    const dispatch = useAppDispatch()
    const [getChatsTrigger] = useLazyGetChatsQuery()

    useEffect(()=>{
        if(isSuccess && data){
            dispatch(updateLoggedInUser(data))
            getChatsTrigger()
        }
    },[isSuccess])

}
