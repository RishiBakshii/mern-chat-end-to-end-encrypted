import { useState } from "react"
import { ACCEPTED_IMAGE_TYPES, DEFAULT_AVATAR } from "../../../constants"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupChatSchemaType, groupChatSchema } from "../../../schemas/chat"
import toast from "react-hot-toast"
import { selectLoggedInUser } from "../../../services/redux/slices/authSlice"
import { IChatMember } from "../../../interfaces/chat"
import { useToast } from "../../../hooks/useToast"
import { useCreateChatMutation, useGetChatsQuery } from "../../../services/api/chatApi"
import { useAppSelector } from "../../../services/redux/store/hooks"



export const GroupChatForm = () => {

  const [image,setImage] = useState<Blob>()
  const [preview,setPreview] = useState<string>()
  const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const [createChat, {isLoading,isError,isSuccess,error,isUninitialized}] = useCreateChatMutation()


  useToast({isLoading,isUninitialized,isSuccess,isError,error})

  const {friends} = useGetChatsQuery(undefined,{

    selectFromResult:({data})=>{

      const allMembers = data?.flatMap(chat=>chat.members)
      const uniqueMemberIds = Array.from(new Set(allMembers?.map(member=>member._id).filter(memberId=>memberId!==loggedInUser?._id)))

      const friends:IChatMember[] = []

      uniqueMemberIds.map(uniqueId=>{
        const data = allMembers?.find(member=>member._id===uniqueId)

        if(data){
          friends.push(data)
        }
      })

      return {
        friends
      }
    }

  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm<GroupChatSchemaType>({
    resolver:zodResolver(groupChatSchema)
  })

  const nameValue = watch("name")

  const onSubmit: SubmitHandler<GroupChatSchemaType> = (data) => {

    if(selectedMembers.length<2){
      return toast.error("Atleast 2 members are required")
    }

    else{

      createChat({
        avatar:image?image:undefined,
        name:data.name,
        isGroupChat:"true",
        members:selectedMembers,
      })
    }
    
  }

  const handleAddOrRemoveMember = (newMember:string)=>{
    if(selectedMembers.includes(newMember)){
      setSelectedMembers(prev=>prev.filter((member)=>member!==newMember))
    }
    else{
      setSelectedMembers(prev=>[...prev,newMember])
    }
  }
  
  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files?.length && e.target.files[0]){
      setPreview(URL.createObjectURL(e.target.files[0]))
      setImage(e.target.files[0])
    }
  }
  

  return (
    <div className="flex flex-col gap-y-4">

      <h5 className="text-2xl">{nameValue?.trim().length?`Creating group ${nameValue.substring(0,25)}`:"Create group chat"}</h5>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">

        <div className="flex flex-col gap-y-4">
            {/* avatar selection */}
            <div className="w-24 rounded-full relative overflow-hidden">
                <input type="file" accept={ACCEPTED_IMAGE_TYPES.join("")} onChange={handleImageChange} className="absolute w-full h-full opacity-0 cursor-pointer"/>
                {
                  preview ? 
                  <img src={preview} className="h-full w-full object-cover" alt="" />
                  :
                  <img src={DEFAULT_AVATAR} className="h-full w-full object-cover" alt="Default avatar" />
                }
            </div>
            
            {/* name input */}
            <div className="w-full flex flex-col gap-y-1">
              <input {...register("name")} className="p-3 rounded w-full outline outline-1 outline-gray-200" placeholder="Group name"/>
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            {/* member selection */}
            <div className="flex flex-col gap-y-3">
              <h4 className="">Select Members</h4>
              <div className="flex flex-wrap gap-3">
                {
                  friends?.map(friend=>(
                    <div onClick={_=>handleAddOrRemoveMember(friend._id)} className={`flex items-center gap-x-2 ${selectedMembers.includes(friend._id)?"bg-violet-500 text-white hover:bg-violet-600 shadow-2xl":"bg-gray-200 text-black hover:bg-gray-300"} p-2 rounded-lg cursor-pointer`}>
                      <img className="h-7 w-7 object-cover rounded-full" src={friend.avatar} alt={`${friend.username} avatar`} />
                      <p className="text-inherit">{friend.username}</p>
                    </div>
                  ))
                }
              </div>
            </div>
        </div>

        <button type="submit" className="px-6 py-2 bg-violet-500 text-white rounded shadow-lg">Create group</button>
      </form>

    </div>
  )
}
