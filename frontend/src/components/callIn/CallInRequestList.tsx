import { ICallAcceptEventPayloadData, ICallInRequestEventReceiveData } from "../../interfaces/callIn"
import { CallInAcceptorRejectCard } from "./CallInAcceptorRejectCard"

type PropTypes = {
    callInRequests: Array<ICallInRequestEventReceiveData>
    rejectCallInRequest: (chatId: string, callerId: string) => void
    acceptCallInRequest: ({ callerId, chat }: ICallAcceptEventPayloadData) => void
}

export const CallInRequestList = ({callInRequests,acceptCallInRequest,rejectCallInRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-6">
        {
            callInRequests.map(request=>(

                <CallInAcceptorRejectCard
                    key={request.caller._id}
                    request={request}
                    acceptCallInRequest={acceptCallInRequest}
                    rejectCallInRequest={rejectCallInRequest}
                />
            ))
        }
    </div>
  )
}
