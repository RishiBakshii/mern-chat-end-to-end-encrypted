import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useVerifyOAuthTempToken } from '../hooks/useAuth/useVerifyOAuthTempToken'

export const OAuthRedirectHandlerPage = () => {

    const {tempToken} = useParams<{tempToken:string}>()
    
    const {verifyTempToken} = useVerifyOAuthTempToken()

    useEffect(()=>{
        if(tempToken) verifyTempToken({tempToken}) 
    },[tempToken])

  return (
    <div className="bg-background w-full h-full text-text text-xl">Redirecting...</div>
  )
}
