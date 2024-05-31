import { ICallAcceptEventPayloadData, ICallInRequestEventReceiveData } from "../../interfaces/callIn"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    request: ICallInRequestEventReceiveData
    rejectCallInRequest: (chatId: string, callerId: string) => void
    acceptCallInRequest: ({ callerId, chat }: ICallAcceptEventPayloadData) => void
}

export const CallInAcceptorRejectCard = ({request:{chat,caller},acceptCallInRequest,rejectCallInRequest}:PropTypes) => {
  return (

    <div className="flex justify-between">
        
        <div className="flex gap-x-4">

            <Avatar imgUrl={caller.avatar} width={14} height={14} alt={caller.username}/>

            <div className="flex flex-col">
                <p>{caller.username}</p>
                <p>Sent you a call-in request for </p>
                <div className="flex items-center gap-x-2">
                    <p className="font-medium text-primary-dark">{chat.chatName}</p>
                    <Avatar imgUrl={chat.avatar} alt={chat.chatName} width={5} height={5}/>
                </div>
                
            </div>
        
        </div>

        <div className="flex items-center gap-x-2 self-start">
                <button onClick={()=>acceptCallInRequest({callerId:caller._id,chat:{avatar:chat.avatar,chatId:chat.chatId,name:chat.chatName}})}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-green-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>

                <button onClick={()=>rejectCallInRequest(chat.chatId,caller._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 hover:text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
        </div>
    </div>

  )
}
