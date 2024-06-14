import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSendAuthCookie } from '../hooks/useAuth/useSendAuthCookie'
import { updateLoggedInUser } from "../services/redux/slices/authSlice"
import { useAppDispatch } from "../services/redux/store/hooks"

export const OAuthRedirectHandlerPage = () => {
    
    const dispatch = useAppDispatch()

    const {tempToken} = useParams<{tempToken:string}>()
    
    const {sendAuthCookie,data,isSuccess} = useSendAuthCookie()


    useEffect(()=>{
        if(isSuccess && data) {
            dispatch(updateLoggedInUser(data))
        }
    },[isSuccess,data])

    useEffect(()=>{
        if(tempToken) {
            sendAuthCookie({tempToken})
        } 
    },[tempToken])

  return (
    <div className="bg-background w-full h-full text-text text-xl">Redirecting...</div>
  )
}
