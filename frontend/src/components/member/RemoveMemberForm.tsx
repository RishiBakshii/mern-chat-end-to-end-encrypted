import { useState } from "react"
import { useRemoveMember } from "../../hooks/useMember/useRemoveMember"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { MemberList } from "./MemberList"
import { setRemoveMemberForm } from "../../services/redux/slices/uiSlice"

export const RemoveMemberForm = () => {

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const loggedInUser = useAppSelector(selectLoggedInUser)
    const dispatch  = useAppDispatch()

    const {removeMember} = useRemoveMember()

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

        dispatch(setRemoveMemberForm(false))

    }

    const handleLeaveGroup = ()=>{

        if(selectedChatDetails && loggedInUser){
            removeMember({chatId:selectedChatDetails._id,memberIds:[loggedInUser._id]})
        }

        dispatch(setRemoveMemberForm(false))
    }

  return (

    <div className="flex flex-col gap-y-5">

        <h4 className="text-xl">Remove Member</h4>

        <div className="overflow-y-scroll max-h-52">
            {
                selectedChatDetails &&
                <MemberList
                    members={selectedChatDetails.members.filter(member=>member._id!==loggedInUser?._id)}
                    selectedMembers={selectedMembers}
                    toggleSelection={toggleSelection}
                />
            }
        </div>
        
        <div className="flex flex-col gap-y-2">
            <button onClick={handleRemoveMember} disabled={selectedMembers.length===0} className="bg-primary text-white py-2 rounded-sm disabled:bg-gray-400">Remove</button>
            <button onClick={handleLeaveGroup} className="bg-red-500 py-2 rounded-sm text-white">Leave Group</button>
        </div>

    </div>
  )
}
