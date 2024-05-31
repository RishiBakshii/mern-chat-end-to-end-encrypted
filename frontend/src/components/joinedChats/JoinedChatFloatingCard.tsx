import { motion } from 'framer-motion'
import { IJoinedChat } from '../../interfaces/callIn'
import { Badge } from '../ui/Badge'

type PropTypes = {
  joinedChat: IJoinedChat
  toggleJoinedChatOpenClose:(chatId: string) => void
}

export const JoinedChatFloatingCard = ({joinedChat,toggleJoinedChatOpenClose}:PropTypes) => {
  return (
    <motion.div onClick={()=>toggleJoinedChatOpenClose(joinedChat.chatId)}  drag style={{backgroundImage:`url(${joinedChat.avatar})`}} className="bg-cover bg-center w-16 h-16 fixed top-0 right-0 rounded-full cursor-pointer z-50">  
      <Badge value={joinedChat.unreadMessages.count}/>
    </motion.div>
  )
}
