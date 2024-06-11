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

        <textarea cols={25} value={updatedContentValue} onChange={e=>setUpdatedContentValue(e.target.value)} className="p-4 text-text bg-primary focus:border-none focus:outline-none"/>
        
        <div className="flex justify-end gap-x-1 w-full">
          
              <motion.button whileHover={{scale:1.050}} whileTap={{scale:0.950}} onClick={handleCancel} type="button" className="bg-red-500/85 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <motion.button whileHover={{scale:1.050}} whileTap={{scale:0.950}} disabled={updatedContentValue.trim()===prevContentValue.trim() || !updatedContentValue.trim()} type="submit" className="bg-background text-text p-2 rounded-full disabled:bg-secondary-darker ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
              </motion.button>
        </div>
    </motion.form>
  )
}
