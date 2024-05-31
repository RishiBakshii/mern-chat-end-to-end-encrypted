
import { IJoinedChat } from '../../interfaces/callIn'
import { JoinedChatFloatingCard } from './JoinedChatFloatingCard'

type PropTypes = {
    joinedChats:Array<IJoinedChat>
    toggleJoinedChatOpenClose:(chatId: string) => void
}

export const JoinedChatFloatingList = ({joinedChats,toggleJoinedChatOpenClose}:PropTypes) => {

  return (
        joinedChats.map(joinedChat=>(
            <JoinedChatFloatingCard
              joinedChat={joinedChat}
              toggleJoinedChatOpenClose={toggleJoinedChatOpenClose}
            />
        ))
  )
}
