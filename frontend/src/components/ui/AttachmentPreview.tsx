import { useState } from "react"
import { selectAttachments } from "../../services/redux/slices/uiSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

export const AttachmentPreview = () => {

    const attachments = useAppSelector(selectAttachments)

    const [currentAttachmentIndex, setcurrentAttachmentIndex] = useState(0)

    const handlePreviousClick =()=> {
        if(currentAttachmentIndex!==0){
            setcurrentAttachmentIndex(prev=>prev-1)   
        }
    }

    const handleNextClick = ()=> {
        if(currentAttachmentIndex!==attachments.length-1){
            setcurrentAttachmentIndex(prev=>prev+1)
        }
    }

  return (
    <div className="flex flex-col justify-center items-center py-4 gap-y-10 ">

        <div className="flex items-center gap-x-4">

            <button onClick={handlePreviousClick} className="max-sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            <img className="w-[25rem] h-[30rem] max-lg:w-[25rem] max-lg:h-[25rem] max-md:w-[20rem] max-md:h-[20rem] max-sm:w-[] max-sm:h-[] object-contain" src={attachments[currentAttachmentIndex]} alt="image" />
            
            <button onClick={handleNextClick} className="max-sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>

        </div>

        <div className="flex items-center w-full justify-center flex-wrap gap-y-4 gap-x-2">
            {
                attachments.map((attachment,index)=>(
                    <img onClick={()=>setcurrentAttachmentIndex(index)} className={`w-20 h-20 object-contain cursor-pointer ${currentAttachmentIndex===index?"outline outline-1 outline-secondary-darker p-1 rounded-sm":null} `} src={attachment} alt="" />
                ))
            }
        </div>

    </div>
  )
}
