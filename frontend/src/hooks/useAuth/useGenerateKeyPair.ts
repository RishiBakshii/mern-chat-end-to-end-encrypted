import { useEffect } from "react"
import { updateLoggedInUserPublicKey } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { convertCryptoKeyToJwk, encryptPrivateKey, generateKeyPair } from "../../utils/encryption"
import { storePrivateKey } from "../../utils/indexedDB"
import { useUpdateUserKeys } from "./useUpdateUserKeys"

export const useGenerateKeyPair = (isSignupSuccess:boolean,loggedInUserId:string | undefined,password:string) => {

    const dispatch = useAppDispatch()
    const {updateUserKeys,addedPublicKey,updateUserKeysSuccess} = useUpdateUserKeys()
    

    const handleGenerateKeyPair = async()=>{

       const keys = await generateKeyPair()

       const publicJwkKey = await convertCryptoKeyToJwk(keys.publicKey)

       
       const privateJwkKey = await convertCryptoKeyToJwk(keys.privateKey)
       
       updateUserKeys({publicKey:JSON.stringify(publicJwkKey),privateKey:await encryptPrivateKey(password,privateJwkKey)})

        if(loggedInUserId){
            storePrivateKey(loggedInUserId,privateJwkKey)
        }
    }

    useEffect(()=>{
        if(updateUserKeysSuccess && addedPublicKey){
            dispatch(updateLoggedInUserPublicKey({publicKey:addedPublicKey}))
        }
    },[updateUserKeysSuccess,addedPublicKey])

    useEffect(()=>{
        if(isSignupSuccess && loggedInUserId){
            handleGenerateKeyPair()
        }
    },[isSignupSuccess,loggedInUserId])
}
