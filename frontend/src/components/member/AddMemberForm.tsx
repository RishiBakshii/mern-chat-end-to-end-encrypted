import { useEffect, useState } from "react"
import { useAddMember } from "../../hooks/useMember/useAddMember"
import { IFriend } from "../../interfaces/friends"
import { useGetFriendsQuery } from "../../services/api/friendApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { MemberList } from "./MemberList"
import {motion} from 'framer-motion'
import { useToggleAddMemberForm } from "../../hooks/useUI/useToggleAddMemberForm"

export const AddMemberForm = () => {

  const {data:friends} = useGetFriendsQuery()
  
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
  const toggleAddMemberForm = useToggleAddMemberForm()

  const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])
  const [searchVal,setSearchVal] = useState<string>('')
  const [filteredFriends, setFilteredFriends] = useState<Array<IFriend>>([]);

  const {addMember} = useAddMember()

  const handleAddMember = () => {
    if(selectedChatDetails?._id){
      toggleAddMemberForm()
      addMember({_id:selectedChatDetails?._id,members:selectedMembers})
    }
  }

  useEffect(() => {
    if (friends) {
      const filtered = friends.filter(friend => friend.username.toLowerCase().includes(searchVal.toLowerCase()));
      setFilteredFriends(filtered);
    }
  }, [searchVal,friends]);

  const toggleSelection = (memberId:string)=>{
    if(selectedMembers.includes(memberId)){
      setSelectedMembers(prev=>prev.filter(member=>member!==memberId))
    }
    else{
      setSelectedMembers(prev=>[...prev,memberId])
    }
  }

  return (
    <div className="flex flex-col gap-y-5">

      <h4 className="text-xl">Add members to {selectedChatDetails?.name} </h4>

      <input value={searchVal} onChange={e=>setSearchVal(e.target.value)} className="p-3 rounded w-full text-text bg-background outline outline-1 outline-secondary-darker" placeholder="Search Friends"/>

      <div className="overflow-y-auto max-h-52">

        <MemberList
          selectable={true}
          existingMembers={selectedChatDetails?.members || []}
          members={filteredFriends}
          selectedMembers={selectedMembers}
          toggleSelection={toggleSelection} 
        />

      </div>

      {
        selectedMembers.length!==0 &&
        <motion.button  initial={{y:5}} animate={{y:0}} onClick={handleAddMember} className="bg-primary text-white py-2 rounded-sm disabled:bg-gray-400">Add member</motion.button>
      }

    </div>
  )
}
