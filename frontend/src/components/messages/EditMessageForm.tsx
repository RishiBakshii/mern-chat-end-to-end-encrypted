import { useState } from "react"
import { useEditMessage } from "../../hooks/useMessages/useEditMessage"

type PropTypes = {
    prevContentValue:string
    messageId:string
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const EditMessageForm = ({prevContentValue,messageId,setEditMessageId,setOpenContextMenuMessageId}:PropTypes) => {
  
  const [updatedContentValue,setUpdatedContentValue] = useState<string>(prevContentValue)
  
  const editMessageHandler =  useEditMessage()

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{

    e.preventDefault()
    e.stopPropagation()

    editMessageHandler(messageId,updatedContentValue.trim())

    setEditMessageId("")
    setOpenContextMenuMessageId("")
  }

  const handleCancel = ()=>{
    setEditMessageId("")
    setOpenContextMenuMessageId("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-y-3 flex-col ">
        <textarea cols={30} value={updatedContentValue} onChange={e=>setUpdatedContentValue(e.target.value)} className="p-4 text-text bg-background outline outline-1 outline-secondary-dark"/>
        
        <div className="flex items-center gap-x-2">
          <button  disabled={updatedContentValue.trim()===prevContentValue.trim() || !updatedContentValue.trim()} type="submit" className="bg-secondary-dark text-text px-6 py-2 rounded-md disabled:bg-secondary">
            Update
          </button>
          <button onClick={handleCancel} type="button" className="bg-red-500 text-white px-6 py-2 rounded-md">
            Cancel
          </button>
        </div>
    </form>
  )
}
