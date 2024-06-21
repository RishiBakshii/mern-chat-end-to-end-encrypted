import { EmojiClickData } from 'emoji-picker-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { ACCEPTED_FILE_MIME_TYPES } from "../../constants"
import { useSendAttachments } from '../../hooks/useAttachment/useSendAttachments'
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent"
import { useSendMessage } from "../../hooks/useMessages/useSendMessage"
import { useToggleGif } from '../../hooks/useUI/useToggleGif'
import { useTogglePoolForm } from '../../hooks/useUI/useTogglePoolForm'
import { useDebounce } from "../../hooks/useUtils/useDebounce"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { EmojiPickerForm } from '../emoji/EmojiPickerForm'
import { MessageInput } from "../ui/MessageInput"
import { GalleryIcon } from '../ui/icons/GalleryIcon'
import { PollingIcon } from '../ui/icons/PollingIcon'

export const MessageForm = () => {

    const {toggleGifForm} = useToggleGif()
    const {togglePollForm} = useTogglePoolForm()

    const pickerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        event.stopPropagation()
        if (pickerRef.current && !(pickerRef.current as any).contains(event.target)) {
          setEmojiForm(false)
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

    const [messageVal,setMessageVal] = useState<string>('')

    const [selectedAttachments,setSelectedAttachments] = useState<Array<Blob>>()
    const [attachmentsPreview,setAttachmentsPreview] = useState<Array<string>>()

    const [attachmentsMenu,setAttachmentsMenu] = useState<boolean>(false)
    const [emojiForm,setEmojiForm] = useState<boolean>(false)

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const {uploadAttachment} = useSendAttachments()

    useEffect(()=>{
      if(selectedAttachments?.length){

        setAttachmentsPreview(selectedAttachments.map(attachment=>URL.createObjectURL(attachment)))
      }
    },[selectedAttachments])

    const isTyping = useDebounce(messageVal,350)
    useEmitTypingEvent(isTyping)

    const {sendMessage} = useSendMessage()

    const handleMessageSubmit = (e:React.FormEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setMessageVal('')

        if(messageVal.trim().length){
          sendMessage(messageVal,undefined)
          setEmojiForm(false)
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

    const handleEmojiSelect = (e:EmojiClickData)=>{
      setMessageVal(val=>val+e.emoji)
    }

    const handlePollClick = ()=>{
      setAttachmentsMenu(false)
      togglePollForm()
    }
    
  return (
    <form onSubmit={handleMessageSubmit} className="relative" autoComplete='off' aria-autocomplete='none' >

        {
          attachmentsPreview && attachmentsPreview?.length>0 && 

          <div className="flex items-center flex-wrap gap-4 ml-auto w-fit">

            <div className="flex flex-wrap gap-2 mb-5">
              {
                  attachmentsPreview.map((preview,index)=>(
                    <motion.div whileHover={{scale:1.050,y:-5}} className="relative">
                      <button onClick={()=>handleRemoveSelectedAttachment(index)} className="absolute bg-gray-300 rounded-full w-7 h-7 -right-2 -top-2">-</button>
                      <img className="w-20 h-20 object-cover" src={preview} alt="" />
                    </motion.div>
                  ))
              }
            </div>

            <motion.button type="button" onClick={handleUploadAttachments} className="p-4 bg-primary text-white rounded-full shadow-xl">
                
                <div className="flex items-center gap-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                  </svg>
                  <p className="hidden">Uploading</p>
                </div>
            </motion.button>


          </div>
        }

        <AnimatePresence>
        {
          attachmentsMenu && 

          <motion.div variants={{hide:{y:40,opacity:0},show:{y:0,opacity:1}}} initial="hide" exit={"hide"} animate="show" className="bg-secondary-dark p-4 w-36 rounded-md absolute -top-28 right-0 flex justify-between">

            <div className="flex flex-col items-center relative">
                <GalleryIcon/>
                <p className="text-text">Gallery</p>
                <input onChange={handleFileChange} accept={ACCEPTED_FILE_MIME_TYPES.join(",")} multiple type="file" className="absolute w-full h-full opacity-0 cursor-pointer"/>
            </div>

            <div onClick={handlePollClick} className="flex flex-col items-center cursor-pointer">
              <PollingIcon/>
              <p className="text-text">Poll</p>
            </div>

          </motion.div>
        }
        </AnimatePresence>

        <AnimatePresence>

          {
            emojiForm &&
            <motion.div ref={pickerRef} variants={{hide:{y:40,opacity:0},show:{y:0,opacity:1}}} initial="hide" exit={"hide"} animate="show" className="absolute bottom-20 left-0">
                <EmojiPickerForm
                  onEmojiClick={handleEmojiSelect}
                />
            </motion.div>
          }
        
        </AnimatePresence>


        <MessageInput
          handleFileChange={handleFileChange} 
          toggleGif={toggleGifForm} 
          messageVal={messageVal} 
          setMessageVal={setMessageVal}
          toggleAttachmentsMenu={setAttachmentsMenu}
          toggleEmojiForm={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
            e.stopPropagation();
            e.preventDefault();
            setEmojiForm(prev=>!prev)
          }}
        />
    </form>
  )
}
