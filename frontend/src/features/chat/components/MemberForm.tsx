import { useAppSelector } from "../../../app/hooks"
import { useToast } from "../../../hooks/useToast"
import { selectLoggedInUser } from "../../auth/authSlice"
import { useGetChatsQuery, useRemoveMemberMutation } from "../api"
import { selectSelectedChatId } from "../chatSlice"
import { MemberList } from "./MemberList"

export const MemberForm = () => {

    const {data:chats} = useGetChatsQuery()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const loggedInUser = useAppSelector(selectLoggedInUser)

    const [removeMemberTrigger,{
        error,
        isError,
        isLoading,
        isSuccess,
        isUninitialized,
    }] = useRemoveMemberMutation()

    useToast({
        error,
        isError,
        isLoading,
        isSuccess,
        isUninitialized,
        loaderToast:true,
        successMessage:"Member removed",
        successToast:true,
    })

    const removeHandler = (chatId: string, memberId: string)=> {
        removeMemberTrigger({chatId,memberId})
    }

  return (
    <MemberList isGroupChat={chats?.find(chat=>chat._id===selectedChatId)?.isGroupChat} chatId={chats?.find(chat=>chat._id===selectedChatId)?._id} isRemovable={true} removeHandler={removeHandler}  loggedInUserId={loggedInUser?._id!} chatAdminId={chats?.find(chat=>chat._id===selectedChatId)?.admin} members={chats?.find(chat=>chat._id===selectedChatId)?.members}/>
  )
}
