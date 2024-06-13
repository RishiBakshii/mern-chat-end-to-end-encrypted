import { useEffect } from "react"
import { useVerifyPrivateKeyTokenMutation } from "../../services/api/authApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { decryptPrivateKey } from "../../utils/encryption"
import { useToast } from "../useUI/useToast"
import { storePrivateKey } from "../../utils/indexedDB"
import toast from "react-hot-toast"

export const useVerifyPrivateKeyToken = () => {

    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id


    const [verifyRecoveryToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyPrivateKeyTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Verification successful",successToast:true})

    const handleDecrptPrivateKey = async()=>{

        if(isSuccess && (data?.privateKey || data?.combinedSecret) && loggedInUserId){

            let password

            if(data.combinedSecret) password = data.combinedSecret

            else {
                const passRef = localStorage.getItem("tempPassRef")

                if(passRef){
                    password = passRef
                }

                else{
                    toast.error("Some error occured")
                }
            }

            if(password) {
                const privateKeyInJwk = await decryptPrivateKey(password,data.privateKey)
                storePrivateKey(loggedInUserId,privateKeyInJwk)
                localStorage.removeItem("tempPassRef")
            }
            else{
                toast.error("Some error occured while recovering")
            }

        }
    }

    useEffect(()=>{
        if(isSuccess && data) handleDecrptPrivateKey()
    },[isSuccess,data])

    return {
        verifyRecoveryToken,
        isSuccess,
    }
}
