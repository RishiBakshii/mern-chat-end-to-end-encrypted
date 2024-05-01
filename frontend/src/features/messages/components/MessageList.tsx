import { IMessage } from "../../../interfaces/messages"
import { MessageItem } from "./MessageItem"

type PropTypes = {
  messages:Array<IMessage>
}
export const MessageList = ({messages}:PropTypes) => {
  return (
    <>
      {messages.map(message => (
        <MessageItem key={message._id} message={message} />
      ))}
    </>
  )
}
