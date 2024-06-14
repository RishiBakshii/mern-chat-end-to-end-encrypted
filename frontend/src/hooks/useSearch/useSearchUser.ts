import { useLazySearchUserQuery } from "../../services/api/userApi"
import { useToast } from "../useUI/useToast"

export const useSearchUser = () => {

    const [searchUser,{error,isError,isFetching,isSuccess,isUninitialized,data}] = useLazySearchUserQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

    return {
        searchUser,
        searchResults:data,
        isFetching,
    }
}
