import type { IUser } from "../../../interfaces/auth"
import type { IMessage } from "../../../interfaces/messages"
import { MessageItem } from "./MessageItem"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
}
export const MessageList = ({messages,loggedInUserId}:PropTypes) => {
  return (
    <>
      {messages.map(message => (
        <MessageItem key={message._id} message={message} myMessage={loggedInUserId===message.sender._id} />
      ))}
    </>
  )
}