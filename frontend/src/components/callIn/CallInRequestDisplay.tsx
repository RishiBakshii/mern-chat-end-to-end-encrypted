import { useAcceptCallInRequest } from "../../hooks/useCallIn/useAcceptCallInRequest"
import { useRejectCallInRequest } from "../../hooks/useCallIn/useRejectCallInRequest"
import { ICallAcceptEventPayloadData } from "../../interfaces/callIn"
import { deleteCallInRequest, selectCallInRequests } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { CallInRequestList } from "./CallInRequestList"

export const CallInRequestDisplay = () => {

    const callInRequests = useAppSelector(selectCallInRequests)
    const dispatch = useAppDispatch()

    const rejectCallInRequest = useRejectCallInRequest()
    const acceptCallInRequest = useAcceptCallInRequest()

    const handleCallInRequest = ({callerId,chat}:ICallAcceptEventPayloadData)=>{
        acceptCallInRequest({callerId,chat})
        dispatch(deleteCallInRequest({chatId:chat.chatId}))
    }

    const handleRejectCallInRequest = (chatId:string,callerId:string) =>{
        rejectCallInRequest(callerId)
        dispatch(deleteCallInRequest({chatId}))
    }

  return (
    <div className="flex flex-col gap-y-8 max-h-96">

        <h4 className="text-xl font-medium">Call in requests</h4>
        
        <CallInRequestList
          callInRequests={callInRequests}
          acceptCallInRequest={handleCallInRequest}
          rejectCallInRequest={handleRejectCallInRequest}
        />

    </div>
  )
}
