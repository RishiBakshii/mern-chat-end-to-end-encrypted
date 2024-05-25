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
  togglePoolForm:()=>void
}

export const MessageForm = ({toggleGif,togglePoolForm}:PropTypes) => {

    const [messageVal,setMessageVal] = useState<string>('')

    const [selectedAttachments,setSelectedAttachments] = useState<Array<Blob>>()
    const [attachmentsPreview,setAttachmentsPreview] = useState<Array<string>>()

    const [attachmentsMenu,setAttachmentsMenu] = useState<boolean>(false)

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const [uploadAttachment , {error,isError,isLoading,isSuccess,isUninitialized} ] = useSendAttachmentsMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Attachments sent",successToast:true})

    useEffect(()=>{
      if(selectedAttachments?.length){

        setAttachmentsPreview(selectedAttachments.map(attachment=>URL.createObjectURL(attachment)))
      }
    },[selectedAttachments])

    const isTyping = useDebounce(messageVal,350)

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

        setAttachmentsMenu(false)

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
    <form onSubmit={handleMessageSubmit} className="relative">

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

            <button type="button" onClick={handleUploadAttachments} className="px-4 py-2 bg-primary text-white rounded-sm shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
            </button>


          </div>
        }

        {
          attachmentsMenu && 

          <div className="bg-secondary-dark p-4 w-36 rounded-md absolute -top-28 flex justify-between">

            <div className="flex flex-col items-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-text">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <p className="text-text">Gallery</p>
                <input onChange={handleFileChange} accept={ACCEPTED_FILE_MIME_TYPES.join(",")} multiple type="file" className="absolute w-full h-full opacity-0 cursor-pointer"/>
            </div>

            <div onClick={togglePoolForm} className="flex flex-col items-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-text">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              <p className="text-text">Poll</p>
            </div>



          </div>
        }

        <MessageInput
         handleFileChange={handleFileChange} 
         toggleGif={toggleGif} 
         messageVal={messageVal} 
         setMessageVal={setMessageVal}
         toggleAttachmentsMenu={setAttachmentsMenu}
        />
    </form>
  )
}
