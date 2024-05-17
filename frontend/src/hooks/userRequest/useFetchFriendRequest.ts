import { useGetUserFriendRequestsQuery } from "../../services/api/requestApi"
import { useToast } from "../useUI/useToast"

export const useFetchFriendRequest = () => {

    const {error,isError,isFetching,isSuccess,isUninitialized} = useGetUserFriendRequestsQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})
}
