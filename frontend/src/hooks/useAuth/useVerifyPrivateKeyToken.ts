import { useEffect } from "react"
import { useVerifyPrivateKeyTokenMutation } from "../../services/api/authApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { decryptPrivateKey } from "../../utils/encryption"
import { useToast } from "../useUI/useToast"
import { storePrivateKey } from "../../utils/indexedDB"

export const useVerifyPrivateKeyToken = () => {

    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id


    const [verifyRecoveryToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyPrivateKeyTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Verification successful",successToast:true})

    useEffect(()=>{

        const handleDecrptPrivateKey = async()=>{

            if(isSuccess && data?.privateKey && loggedInUserId){
    
                console.log("encrypted private Key",data.privateKey);

                const privateKeyInJwk = await decryptPrivateKey("helloWorld@123",data.privateKey)
                storePrivateKey(loggedInUserId,privateKeyInJwk)
            }
        }

        if(isSuccess && data){
            handleDecrptPrivateKey()
        }


    },[isSuccess,data])

    return {
        verifyRecoveryToken,
        isSuccess,
    }
}
