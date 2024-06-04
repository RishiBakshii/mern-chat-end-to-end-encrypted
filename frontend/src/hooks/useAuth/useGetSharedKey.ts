import { IChatMember } from "../../interfaces/chat";
import { convertJwkToCryptoKey, deriveSharedSecret } from "../../utils/encryption"
import { getPrivateKey, getStoredSharedKey, storeSharedKey } from "../../utils/indexedDB"

export const useGetSharedKey = () => {


    return async(loggedInUserId:string,otherMember:IChatMember)=>{

        let sharedSecret;

        if(loggedInUserId){
            
            const existingSharedKey = await getStoredSharedKey(loggedInUserId,otherMember._id)
        
            if(existingSharedKey){
                sharedSecret  = await convertJwkToCryptoKey(existingSharedKey,true)
                return sharedSecret
            }
            else{

                const privateKey = await getPrivateKey(loggedInUserId)

                if(privateKey){
                    const cryptoPrivateKey  = await convertJwkToCryptoKey(privateKey,true)
                    const otherMemberPublicCryptoKey = await convertJwkToCryptoKey(JSON.parse(otherMember.publicKey),false)
                    sharedSecret = await deriveSharedSecret(cryptoPrivateKey,otherMemberPublicCryptoKey) as CryptoKey
                    await storeSharedKey(loggedInUserId,otherMember._id,sharedSecret)

                    return sharedSecret

                }


            }
        }
        
    }
}
