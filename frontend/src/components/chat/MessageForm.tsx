import { useState } from "react"
import { useMessageSubmit } from "../../hooks/useMessageSubmit"
import { useUserTyping } from "../../hooks/useUserTyping"
import { MessageInput } from "../ui/MessageInput"


export const MessageForm = () => {

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
        <MessageInput messageVal={messageVal} setMessageVal={setMessageVal}/>
    </form>
  )
}
