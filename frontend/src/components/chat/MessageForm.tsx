import { useState } from "react"
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent"
import { useSendMessage } from "../../hooks/useMessages/useSendMessage"
import { useDebounce } from "../../hooks/useUtils/useDebounce"
import { MessageInput } from "../ui/MessageInput"

type PropTypes = {
  toggleGif:()=>void
}

export const MessageForm = ({toggleGif}:PropTypes) => {

    const [messageVal,setMessageVal] = useState<string>('')

    const isTyping = useDebounce(messageVal)

    useEmitTypingEvent(isTyping)

    const sendMessage = useSendMessage()

    const handleMessageSubmit = (e:React.FormEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setMessageVal('')
        sendMessage(messageVal,undefined)
    }
    
  return (
    <form onSubmit={handleMessageSubmit}>
        <MessageInput toggleGif={toggleGif} messageVal={messageVal} setMessageVal={setMessageVal}/>
    </form>
  )
}
