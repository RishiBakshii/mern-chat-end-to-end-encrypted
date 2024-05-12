import { useEffect, useState } from "react"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useUpdateProfileMutation } from "../../services/api/userApi"
import { useToast } from "../../hooks/useToast"
import { ACCEPTED_IMAGE_TYPES } from "../../constants"
import { useAppSelector } from "../../services/redux/store/hooks"

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
                    
                    <div className="flex flex-col items-center gap-y-1">
                        
                        <div className="w-40 h-40 rounded-full relative overflow-hidden">
                            <input accept={ACCEPTED_IMAGE_TYPES.join(", ")}  onChange={handleImageChange} className="absolute h-full w-full cursor-pointer opacity-0" type="file" name="" id="" />
                            <img className="w-full h-full object-cover rounded-full" src={preview} alt={`${loggedInUser?.name} avatar`} />
                        </div>

                        <h4 className="font-medium text-xl">{loggedInUser?.username}</h4>
                        <p>{loggedInUser?.email}</p>
                    </div>
    
                    <div className="flex flex-col justify-center items-center">
                        <p>Joined at {new Date(loggedInUser?.createdAt).toDateString()}</p>
                        <p>Last Updated {new Date(loggedInUser?.updatedAt).toDateString()}</p>
                    </div>
                    {
                        editActive && 
                        <button onClick={handleUpdateProfile} className="px-6 mt-2 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded shadow-lg">Update profile</button>
                    }
                </div>
            :
            null
        }
        </div>
    
  )
}
