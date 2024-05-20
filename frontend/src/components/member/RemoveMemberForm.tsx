import { useState } from "react"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { MemberList } from "./MemberList"
import { useRemoveMemberMutation } from "../../services/api/chatApi"
import { useToast } from "../../hooks/useUI/useToast"

export const RemoveMemberForm = () => {

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const [removeMember,{isError,isLoading,isSuccess,isUninitialized,error}] = useRemoveMemberMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successToast:true,successMessage:"Dont forget to call them and say, you are removed 💀"})

    const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])

    const toggleSelection = (memberId:string)=>{
        if(selectedMembers.includes(memberId)){
            setSelectedMembers(prev=>prev.filter(member=>member!==memberId))
        }
        else{
            setSelectedMembers(prev=>[...prev,memberId])
        }
    }

    const handleRemoveMember = ()=>{

        if(selectedChatDetails){
            removeMember({chatId:selectedChatDetails?._id,memberIds:selectedMembers})
        }
    }

  return (

    <div className="flex flex-col gap-y-5">

        <h4 className="text-xl">Remove Member</h4>

        <div className="overflow-y-scroll max-h-52">
            {
                selectedChatDetails &&
                <MemberList
                    members={selectedChatDetails.members}
                    selectedMembers={selectedMembers}
                    toggleSelection={toggleSelection}
                />
            }
        </div>

        <button onClick={handleRemoveMember} disabled={selectedMembers.length===0} className="bg-primary text-white py-2 rounded-sm disabled:bg-gray-400">Remove</button>
    
    </div>
  )
}
