import { useEffect, useState } from "react"
import { updateLoggedInUserPublicKey } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { convertCryptoKeyToJwk, encryptPrivateKey, generateKeyPair } from "../../utils/encryption"
import { storePrivateKey } from "../../utils/indexedDB"
import { useUpdateUserKeys } from "./useUpdateUserKeys"

export const useGenerateKeyPair = (isSignupSuccess:boolean,loggedInUserId:string | undefined,password:string | undefined,OAuthSignup:boolean=false) => {

    const dispatch = useAppDispatch()
    
    const {updateUserKeys,addedPublicKey,updateUserKeysSuccess} = useUpdateUserKeys()
    const [done,setDone] = useState<boolean>(false)

    const handleGenerateKeyPair = async()=>{
        console.log('generate key pair initiated');
        if(password){
            
            const keys = await generateKeyPair()
     
            const publicJwkKey = await convertCryptoKeyToJwk(keys.publicKey)
            const privateJwkKey = await convertCryptoKeyToJwk(keys.privateKey)
            
            updateUserKeys({publicKey:JSON.stringify(publicJwkKey),privateKey:await encryptPrivateKey(password,privateJwkKey)})
     
             if(loggedInUserId){
                 storePrivateKey(loggedInUserId,privateJwkKey)
             }
        }
    }

    useEffect(()=>{
        if(updateUserKeysSuccess && addedPublicKey){
            dispatch(updateLoggedInUserPublicKey({publicKey:addedPublicKey}))
            setDone(true)
        }
    },[updateUserKeysSuccess,addedPublicKey])

    useEffect(()=>{
        if(isSignupSuccess && loggedInUserId && password){
            handleGenerateKeyPair()

        }
    },[isSignupSuccess,loggedInUserId,password])

    return {
        done
    }
}
