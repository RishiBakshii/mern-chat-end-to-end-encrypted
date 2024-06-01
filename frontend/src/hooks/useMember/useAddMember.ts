import { useAddMemberMutation } from "../../services/api/chatApi"
import { useToast } from "../useUI/useToast"

export const useAddMember = () => {

    const [addMember,{isError,isLoading,isSuccess,isUninitialized,error,}] = useAddMemberMutation()
    useToast({isError,isLoading,isSuccess,isUninitialized,error,loaderToast:true,successMessage:"Members Added",successToast:true})

    return {
        addMember
    }
}
