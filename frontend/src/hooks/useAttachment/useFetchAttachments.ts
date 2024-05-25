import { useEffect } from "react"
import { useLazyFetchAttachmentsQuery } from "../../services/api/attachmentApi"
import { useToast } from "../useUI/useToast"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectSelectedChatId } from "../../services/redux/slices/chatSlice"

export const useFetchAttachments = () => {

    const selectedChatId = useAppSelector(selectSelectedChatId)

    const [fetchAttachments, {error,isError,isFetching,isSuccess,isUninitialized,data}] = useLazyFetchAttachmentsQuery()

    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

    useEffect(()=>{
        if(selectedChatId){
            fetchAttachments({chatId:selectedChatId,page:1},true)
        }
    },[selectedChatId])

    return {
        fetchMoreAttachments:fetchAttachments,
        sharedMedia:data,
        isAttachmentsFetching:isFetching
    }
}
