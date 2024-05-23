import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ACCEPTED_FILE_MIME_TYPES } from "../../constants"
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent"
import { useSendMessage } from "../../hooks/useMessages/useSendMessage"
import { useToast } from "../../hooks/useUI/useToast"
import { useDebounce } from "../../hooks/useUtils/useDebounce"
import { useSendAttachmentsMutation } from "../../services/api/attachmentApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { MessageInput } from "../ui/MessageInput"

type PropTypes = {
  toggleGif:()=>void
}

export const MessageForm = ({toggleGif}:PropTypes) => {

    const [messageVal,setMessageVal] = useState<string>('')

    const [selectedAttachments,setSelectedAttachments] = useState<Array<Blob>>()
    const [attachmentsPreview,setAttachmentsPreview] = useState<Array<string>>()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const [uploadAttachment , {error,isError,isLoading,isSuccess,isUninitialized} ] = useSendAttachmentsMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Attachments sent",successToast:true})

    useEffect(()=>{
      if(selectedAttachments?.length){

        setAttachmentsPreview(selectedAttachments.map(attachment=>URL.createObjectURL(attachment)))
      }
    },[selectedAttachments])

    const isTyping = useDebounce(messageVal)

    useEmitTypingEvent(isTyping)

    const sendMessage = useSendMessage()

    const handleMessageSubmit = (e:React.FormEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setMessageVal('')

        if(messageVal.trim().length){
          sendMessage(messageVal,undefined)
        }
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{

        const files = e.target.files

        if(files){

          if(files.length>5){
            e.target.value=''
            toast.error("You can only select 5 files at a time")
            return;
          }

          const invalidFiles = Array.from(files).filter((file) => !ACCEPTED_FILE_MIME_TYPES.includes(file.type));
    
          if(invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
            toast.error(`Unsupported file types: ${invalidFileNames}`);
            e.target.value=''
            return;
          }

          const blobFiles = Array.from(files).map(file=>file as Blob)

          setSelectedAttachments(blobFiles)
          e.target.value=''
        }

    }

    const handleUploadAttachments = ()=>{

      if(selectedChatDetails && selectedAttachments){

        
        uploadAttachment({
          attachments:selectedAttachments,
          chatId:selectedChatDetails?._id,
          members:selectedChatDetails?.members.map(member=>member._id)
        })

        setSelectedAttachments([])
        setAttachmentsPreview([])

      }
    }

    const handleRemoveSelectedAttachment = (indexToBeRemoved:number)=> {

      if(attachmentsPreview?.length===1){
        setAttachmentsPreview([])
      }
      setSelectedAttachments(selectedAttachments?.filter((_,index)=>index!==indexToBeRemoved))

    }
    
  return (
    <form onSubmit={handleMessageSubmit}>

        {
          attachmentsPreview && attachmentsPreview?.length>0 && 

          <div className="flex items-center flex-wrap gap-4">

            <div className="flex flex-wrap gap-2 mb-5">
              {
                  attachmentsPreview.map((preview,index)=>(
                    <div className="relative">
                      <button onClick={()=>handleRemoveSelectedAttachment(index)} className="absolute bg-gray-300 rounded-full w-7 h-7 -right-2 -top-2">-</button>
                      <img className="w-20 h-20 object-cover" src={preview} alt="" />
                    </div>
                  ))
              }

            </div>

            <button type="button" onClick={handleUploadAttachments} className="px-4 py-2 bg-primary text-white rounded-sm shadow-xl">Send attachments</button>


          </div>
        }

        <MessageInput handleFileChange={handleFileChange} toggleGif={toggleGif} messageVal={messageVal} setMessageVal={setMessageVal}/>
    </form>
  )
}
