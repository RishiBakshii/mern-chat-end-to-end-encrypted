import { ChatList } from "./ChatList"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { SearchInput } from "../ui/SearchInput"

type PropTypes = {
    chats:Array<IChatWithUnreadMessages>
}

export const ChatListWithSearch = ({chats}:PropTypes) => {
  return (
    <>
    <SearchInput/>
    <ChatList chats={chats}/>
    </>
  )
}
