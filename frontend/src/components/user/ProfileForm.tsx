import { useEffect, useState } from "react"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useUpdateProfileMutation } from "../../services/api/userApi"
import { useToast } from "../../hooks/useUI/useToast"
import { ACCEPTED_IMAGE_TYPES } from "../../constants"
import { useAppSelector } from "../../services/redux/store/hooks"
import { formatRelativeTime } from "../../utils/helpers"

export const ProfileForm = () => {

    const loggedInUser = useAppSelector(selectLoggedInUser)

    const [updateProfileTrigger,{
        error,
        isError,
        isLoading,
        isSuccess,
        isUninitialized,
    }] = useUpdateProfileMutation()

    useToast({
        error,
        isError,
        isLoading,
        isSuccess,
        isUninitialized,
        loaderToast:true,
        successMessage:"Profile Updated",
        successToast:true
    })

    const [preview,setPreview] = useState<string>(loggedInUser?.avatar!)
    const [image,setImage] = useState<Blob>()
    const [editActive,setEditActive] = useState<boolean>(false)

    useEffect(()=>{
        if(preview!==loggedInUser?.avatar){
            setEditActive(true)
            return
        }
    },[preview])

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {

        if(e.target.files?.length && e.target.files[0]){
            const image = e.target.files[0]
            setPreview(URL.createObjectURL(image))
            setImage(image)
        }
    }

    const handleUpdateProfile = ()=>{
        if(image){
            updateProfileTrigger({avatar:image})
            setEditActive(false)
        }
    }

  return (
      <div>
        {
            loggedInUser ? 
                <div className="flex flex-col items-center gap-y-4 justify-center">
                    
                    <div className="flex flex-col items-center gap-y-4">
                        
                        <div className="w-40 h-40 rounded-full relative overflow-hidden">
                            <input accept={ACCEPTED_IMAGE_TYPES.join(", ")}  onChange={handleImageChange} className="absolute h-full w-full cursor-pointer opacity-0" type="file"/>
                            <img className="w-full h-full object-cover rounded-full" src={preview} alt={`${loggedInUser?.name} avatar`} />
                        </div>

                        <div className="flex flex-col items-center">

                            <div className="flex items-center gap-x-1">
                                    <h4 className="font-medium text-xl">{loggedInUser.username}</h4>
                                    {
                                        loggedInUser.verificationBadge && 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                    }
                            </div>

                            <p>{loggedInUser?.email}</p>
                        </div>

                    </div>
    
                    <p>Joined {formatRelativeTime(new Date(loggedInUser.createdAt))}</p>

                    {
                        editActive && 
                        <button onClick={handleUpdateProfile} className="px-6 mt-2 py-2 bg-primary hover:bg-primary-dark rounded shadow-lg text-white">Update profile</button>
                    }
                </div>
            :
            null
        }
        </div>
    
  )
}
