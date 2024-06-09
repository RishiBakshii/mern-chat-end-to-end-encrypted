import { motion } from "framer-motion"
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
    <motion.form initial={{x:3}} animate={{x:0}} onSubmit={handleSubmit} className="flex items-center gap-y-3 flex-col ">
        <textarea cols={30} value={updatedContentValue} onChange={e=>setUpdatedContentValue(e.target.value)} className="p-4 text-text bg-background outline outline-1 outline-secondary-dark"/>
        
        <div className="flex items-center gap-x-2">
          
              <motion.button whileHover={{scale:1.050}} whileTap={{scale:0.950}} disabled={updatedContentValue.trim()===prevContentValue.trim() || !updatedContentValue.trim()} type="submit" className="bg-green-500 text-text p-2 rounded-full disabled:bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </motion.button>

              <motion.button whileHover={{scale:1.050}} whileTap={{scale:0.950}} onClick={handleCancel} type="button" className="bg-red-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </motion.button>

        </div>
    </motion.form>
  )
}
