import { setAttachments } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

type PropTypes = {
    attachments:Array<string>
}

export const AttachmentList = ({attachments}:PropTypes) => {

  const disptach = useAppDispatch()

  const handleAttachmentsClick = ()=>{
    disptach(setAttachments(attachments))
  }

  return (
    <div onClick={handleAttachmentsClick} className={`grid ${attachments.length==1?"":"grid-cols-2"} cursor-pointer`}>
        {
            attachments.map(attachment=>(
                <img  className="h-full w-full object-cover" key={attachment} src={attachment} alt="attachment" />
            ))
        }
    </div>
  )
}
