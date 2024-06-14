import { useEffect } from "react"
import { convertCryptoKeyToJwk, encryptPrivateKey, generateKeyPair } from "../../utils/encryption"
import { storePrivateKey } from "../../utils/indexedDB"
import { useUpdateUserKeys } from "./useUpdateUserKeys"

export const useGenerateKeyPair = (isSignupSuccess:boolean,loggedInUserId:string | undefined,password:string | undefined,updateLoggedInUserCallBack?: (publicKey?: string) => void) => {

    const {updateUserKeys,addedPublicKey,updateUserKeysSuccess} = useUpdateUserKeys()


    const handleGenerateKeyPair = async()=>{

        console.log('generate key pair initiated');

        if(loggedInUserId && password){
            
            const keys = await generateKeyPair()
     
            const publicJwkKey = await convertCryptoKeyToJwk(keys.publicKey)
            const privateJwkKey = await convertCryptoKeyToJwk(keys.privateKey)
            
            updateUserKeys({publicKey:JSON.stringify(publicJwkKey),privateKey:await encryptPrivateKey(password,privateJwkKey)})
            storePrivateKey(loggedInUserId,privateJwkKey)
        }
    }

    useEffect(()=>{
        if(updateUserKeysSuccess && addedPublicKey){
            if(updateLoggedInUserCallBack) updateLoggedInUserCallBack(addedPublicKey)
        }
    },[updateUserKeysSuccess,addedPublicKey])

    useEffect(()=>{
        if(isSignupSuccess && loggedInUserId && password){
            handleGenerateKeyPair()
        }
    },[isSignupSuccess,loggedInUserId,password])
}
