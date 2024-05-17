import { useGetFriendsQuery } from "../../services/api/friendApi"
import { useToast } from "../useUI/useToast"

export const useFetchFriends = () => {

    const {isError,isFetching,isSuccess,isUninitialized,error,data} = useGetFriendsQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})


    return {isFriendsFetching:isFetching,friends:data}
}
