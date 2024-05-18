import type { IUser } from "../../interfaces/auth"
import type { IMessage } from "../../interfaces/messages"
import { MessageCard } from "./MessageCard"

type PropTypes = {
  messages:Array<IMessage>
  loggedInUserId:IUser['_id']
  isGroupChat:boolean
}
export const MessageList = ({messages,loggedInUserId,isGroupChat}:PropTypes) => {

  return (
    <>
      {messages.map(message => (
        <MessageCard
          url={message.url}
          isTextMessage={!message?.url?.length}
          isGroupChat={isGroupChat} 
          key={message._id} 
          message={message} 
          myMessage={loggedInUserId===message.sender._id} 
        />
      ))}
    </>
  )
}