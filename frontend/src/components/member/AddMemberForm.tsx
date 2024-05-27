import { useEffect, useState } from "react"
import { useToast } from "../../hooks/useUI/useToast"
import { IFriend } from "../../interfaces/friends"
import { useAddMemberMutation } from "../../services/api/chatApi"
import { useGetFriendsQuery } from "../../services/api/friendApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { MemberList } from "./MemberList"

export const AddMemberForm = () => {

  const {data:friends} = useGetFriendsQuery()
  
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

  const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])
  const [searchVal,setSearchVal] = useState<string>('')
  const [filteredFriends, setFilteredFriends] = useState<Array<IFriend>>([]);

  const [addMember,{isError,isLoading,isSuccess,isUninitialized,error}] = useAddMemberMutation()
  useToast({isError,isLoading,isSuccess,isUninitialized,error,loaderToast:true,successMessage:"Members Added",successToast:true})

  const handleAddMember = () => {
    if(selectedChatDetails?._id){
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

      <div className="overflow-y-scroll max-h-52">

        <MemberList
          selectable={true}
          members={filteredFriends}
          selectedMembers={selectedMembers}
          toggleSelection={toggleSelection} 
        />

      </div>

      <button onClick={handleAddMember} disabled={selectedMembers.length===0} className="bg-primary text-white py-2 rounded-sm disabled:bg-gray-400">Add</button>

    </div>
  )
}
