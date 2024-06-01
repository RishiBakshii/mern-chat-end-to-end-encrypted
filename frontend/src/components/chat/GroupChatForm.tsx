import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { ACCEPTED_IMAGE_TYPES, DEFAULT_AVATAR } from "../../constants"
import { GroupChatSchemaType, groupChatSchema } from "../../schemas/chat"
import { useGetFriendsQuery } from "../../services/api/friendApi"
import { FriendList } from "./FriendList"
import { useCreateGroupChat } from "../../hooks/useChat/useCreateGroupChat"
import { useToggleGroupChatForm } from "../../hooks/useUI/useToggleGroupChatForm"


export const GroupChatForm = () => {

  const [image,setImage] = useState<Blob>()
  const [preview,setPreview] = useState<string>()
  const [selectedMembers,setSelectedMembers] = useState<Array<string>>([])


  const {data:friends} = useGetFriendsQuery()

  const {createChat,isSuccess} = useCreateGroupChat()
  const toggleGroupChatForm = useToggleGroupChatForm()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<GroupChatSchemaType>({
    resolver:zodResolver(groupChatSchema)
  })

  useEffect(()=>{

    let timeout:number

    if(isSuccess){
      timeout = setTimeout(() => {
        toggleGroupChatForm()
      }, 1000);
    }

    return ()=>{
      clearTimeout(timeout)
    }

  },[isSuccess])

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
              <input {...register("name")} className="p-3 rounded w-full outline outline-1 outline-secondary-darker text-text bg-background" placeholder="Group name"/>
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            {/* member selection */}
            <div className="flex flex-col gap-y-3">
              <h4 className="">Select Members</h4>

              {
                friends?.length && 

                <FriendList
                  friends={friends}
                  handleAddOrRemoveMember={handleAddOrRemoveMember}
                  selectedMembers={selectedMembers}
                />
                
              }
            </div>
        </div>

        <button type="submit" className="px-6 py-2 bg-primary text-white rounded shadow-lg">Create group</button>
      </form>

    </div>
  )
}
