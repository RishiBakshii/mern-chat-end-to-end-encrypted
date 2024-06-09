import { useEffect, useState } from "react"
import { useSendFriendRequest } from "../../hooks/useFriend/useSendFriendRequest"
import { useSearchUser } from "../../hooks/useSearch/useSearchUser"
import { UserList } from "./UserList"
import { useGetFriendsQuery } from "../../services/api/friendApi"

export const AddFriendForm = () => {

    const [inputVal,setInputVal] = useState<string>()

    const {data:friends} = useGetFriendsQuery()

    const {sendFriendRequest} = useSendFriendRequest()
    const {searchUser,searchResults} = useSearchUser()


    useEffect(()=>{
        let timeoutId:NodeJS.Timeout

        if(inputVal?.trim().length){
            timeoutId = setTimeout(()=>{
                searchUser(inputVal)
            },1000)
        }

        return () => {
            clearInterval(timeoutId)
        }

    },[inputVal])

    const hanldeSendFriendRequest = (receiverId:string)=>{
        sendFriendRequest({receiverId})
    }

  return (
    <div className="flex flex-col gap-y-4 max-h-96 overflow-y-auto">

        <input value={inputVal} onChange={e=>setInputVal(e.target.value)} className="p-3 rounded text-text bg-background w-full border-none outline-none" type="text" placeholder="Search username"/>
        
        <div>
            {
                searchResults?.length && friends && 
                <UserList 
                 users={searchResults} 
                 friends={friends}
                 sendFriendRequest={hanldeSendFriendRequest}
                />
            }
            {
                !inputVal?.trim() && !searchResults?.length &&
                <div className="flex items-center justify-center">
                    <p >Go on try the speed!</p>
                </div>
            }
        </div>
        
    </div>
  )
}
