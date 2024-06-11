import { useUpdateNotificationsMutation } from "../../services/api/userApi"
import { useToast } from "../useUI/useToast"

export const useUpdateNotificationsFlag = () => {


    const [updateNotificationsFlag,{error,isError,isLoading,isSuccess,isUninitialized}] = useUpdateNotificationsMutation() 
    useToast({error,isError,isLoading,isSuccess,isUninitialized})

    return {
        updateNotificationsFlag
    }
}
