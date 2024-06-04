import { setAttachments } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { AttachmentItem } from "./AttachmentItem"

type PropTypes = {
    attachments:Array<string>
}

export const AttachmentList = ({attachments}:PropTypes) => {

  const disptach = useAppDispatch()

  const handleAttachmentsClick = ()=>{
    disptach(setAttachments(attachments))
  }

  return (
    <div onClick={handleAttachmentsClick} className={`${attachments.length==1?"":"grid grid-cols-2"} cursor-pointer`}>
        {
            attachments.map((attachment,index)=>(

              <AttachmentItem 
                key={index}
                attachment={attachment} 
              />

            ))
        }
    </div>
  )
}
