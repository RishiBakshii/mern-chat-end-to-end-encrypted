import { useState } from "react"
import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { IEditMessageEventPayloadData } from "../../interfaces/messages"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"

type PropTypes = {
    prevContentValue:string
    messageId:string
    setEditMessageId: React.Dispatch<React.SetStateAction<string>>
}

export const EditMessageForm = ({prevContentValue,messageId,setEditMessageId}:PropTypes) => {
  
  const [updatedContentValue,setUpdatedContentValue] = useState<string>(prevContentValue)
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

  const socket = getSocket()

  const handleUpdateContentValue =(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
    setUpdatedContentValue(e.target.value)
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    e.stopPropagation()

    if(selectedChatDetails){

        const payload:IEditMessageEventPayloadData = {
            memberIds:selectedChatDetails.members.map(member=>member._id),
            messageId:messageId,
            updatedContent:updatedContentValue,
        }
    
        socket?.emit(Events.MESSAGE_EDIT,payload)
    }

    setEditMessageId("")
    
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-x-3">
        <textarea value={updatedContentValue} onChange={handleUpdateContentValue} className="p-4 text-text bg-background outline outline-1 outline-secondary-dark"/>
        <button type="submit" className="">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </button>
    </form>
  )
}
