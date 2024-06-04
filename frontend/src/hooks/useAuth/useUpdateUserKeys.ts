
import { useUpdateUserKeysMutation } from "../../services/api/authApi"
import { useToast } from "../useUI/useToast"

export const useUpdateUserKeys = () => {

    const [updateUserKeys, {error,isError,isLoading,isSuccess, isUninitialized,data}] = useUpdateUserKeysMutation()
    useToast({error,isError,isLoading,isSuccess, isUninitialized})

    return {
        updateUserKeys,
        updateUserKeysSuccess:isSuccess,
        addedPublicKey:data?.publicKey
    }
}
