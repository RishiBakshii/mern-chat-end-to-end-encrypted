import { useEffect, useState } from "react"
import { useGetFriendsQuery } from "../../services/api/friendApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { Avatar } from "../ui/Avatar"
import { IFriend } from "../../interfaces/friends"
import { useAddMemberMutation } from "../../services/api/chatApi"
import { useToast } from "../../hooks/useUI/useToast"

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
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchVal,friends]);

  const handleAddOrRemoveMember = (memberId:string)=>{
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

      <input value={searchVal} onChange={e=>setSearchVal(e.target.value)} className="p-3 rounded w-full outline outline-1 outline-gray-200" placeholder="Search Friends"/>

      <div className="flex flex-col gap-y-2">
        {
          filteredFriends?.map(friend=>(
            <div onClick={()=>handleAddOrRemoveMember(friend._id)} key={friend._id} className={`flex items-center gap-x-2 rounded-md cursor-pointer ${selectedMembers.includes(friend._id)?"bg-violet-500 text-white hover:bg-violet-600":''} hover:bg-gray-200 p-2 shadow-sm`}>
              <Avatar imgUrl={friend.avatar} height={7} width={7} alt={friend.username}/>
              <p>{friend.username}</p>
            </div>
          ))
        }
      </div>


      <button onClick={handleAddMember} disabled={selectedMembers.length===0} className="bg-violet-500 text-white py-2 rounded-sm disabled:bg-gray-400">Add</button>

    </div>
  )
}
