import { useEffect, useState } from "react"
import { useRemoveMember } from "../../hooks/useMember/useRemoveMember"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { MemberList } from "./MemberList"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import {motion} from 'framer-motion'
import toast from "react-hot-toast"
import { useToggleRemoveMemberForm } from "../../hooks/useUI/useToggleRemoveMemberForm"

export const RemoveMemberForm = () => {

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const toggleRemoveMemberForm = useToggleRemoveMemberForm()

    const loggedInUserId = useAppSelector(selectLoggedInUser)

    const isMemberLength3 = selectedChatDetails && selectedChatDetails?.members.length <= 3

    const [searchVal,setSearchVal] = useState<string>('')
    const [filteredMembers,setFilteredMembers] = useState<IChatWithUnreadMessages['members']>([])
    const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])

    useEffect(()=>{
        if(!searchVal.trim().length && selectedChatDetails){
            setFilteredMembers(selectedChatDetails.members.filter(member=>member._id!==loggedInUserId?._id))
        }
        else{
            setFilteredMembers(
                filteredMembers.filter(member=>member.username.toLowerCase().includes(searchVal.toLowerCase()))
            )
        }
    },[searchVal,selectedChatDetails])

    const {removeMember} = useRemoveMember()

    const toggleSelection = (memberId:string)=>{

        if(selectedChatDetails){

            if(selectedMembers.includes(memberId)){
                setSelectedMembers(prev=>prev.filter(member=>member!==memberId))
            }
            else{
                if(selectedChatDetails.members.length - selectedMembers.length > 3){
                    setSelectedMembers(prev=>[...prev,memberId])
                }
                else{
                    toast.error("Group cannot have less than 3 members")
                }
            }
        }

    }

    const handleRemoveMember = ()=>{

        if(selectedChatDetails){
            toggleRemoveMemberForm()
            removeMember({chatId:selectedChatDetails?._id,memberIds:selectedMembers})
        }
    }

  return (

    <div className="flex flex-col gap-y-5">

        <div className="flex flex-col gap-y-1">
            <h4 className="text-xl">Remove Member</h4>
            {
                isMemberLength3 &&
                <p className="text-secondary-darker max-w-[30rem]">You cannot remove any members as group chat requires a minimum of 3 members</p>
            }
        </div>
        
        <div className="flex flex-col gap-y-4">

            {
                !isMemberLength3 &&
                <input value={searchVal} onChange={e=>setSearchVal(e.target.value)} className="p-3 rounded w-full text-text bg-background outline outline-1 outline-secondary-darker" placeholder="Search Members"/>
            }
            <div className="overflow-y-auto max-h-52 ">
                {
                    selectedChatDetails &&
                    <MemberList
                        selectable={isMemberLength3?false:true}
                        members={filteredMembers}
                        selectedMembers={selectedMembers}
                        toggleSelection={toggleSelection}
                    />
                }
            </div>

        </div>
        
        {
            selectedMembers.length>0 &&
            <motion.div initial={{y:5}} animate={{y:0}} className="flex flex-col gap-y-2">
                    <button onClick={handleRemoveMember} className="bg-red-500 text-white py-2 rounded-sm disabled:bg-gray-400">Remove {selectedMembers.length} {selectedMembers.length===1?"member":"members"}</button>
            </motion.div>
        }

    </div>
  )
}
