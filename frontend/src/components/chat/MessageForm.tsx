import { useState } from "react"
import { useMessageSubmit } from "../../hooks/useMessageSubmit"
import { useUserTyping } from "../../hooks/useUserTyping"
import { MessageInput } from "../ui/MessageInput"

type PropTypes = {
  toggleGif:()=>void
}

export const MessageForm = ({toggleGif}:PropTypes) => {

    const [messageVal,setMessageVal] = useState<string>('')

    const submitMessage = useMessageSubmit()

    useUserTyping(messageVal,250)

    const handleMessageSubmit = (e:React.FormEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setMessageVal('')
        submitMessage(messageVal)
    }
    
  return (
    <form onSubmit={handleMessageSubmit}>
        <MessageInput toggleGif={toggleGif} messageVal={messageVal} setMessageVal={setMessageVal}/>
    </form>
  )
}
