import type { IUser } from "../../../interfaces/auth"
import type { IMessage } from "../../../interfaces/messages"
import { MessageItem } from "./MessageItem"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
}
export const MessageList = ({messages,loggedInUserId,isGroupChat}:PropTypes) => {

  return (
    <>
      {messages.map(message => (
        <MessageItem
          isGroupChat={isGroupChat} 
          key={message._id} 
          message={message} 
          myMessage={loggedInUserId===message.sender._id} 
        />
      ))}
    </>
  )
}