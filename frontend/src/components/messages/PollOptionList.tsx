import { IMessage, IVoteInEventPayloadData } from "../../interfaces/messages"
import { PollOptionCard } from "./PollOptionCard"

type PropTypes = {
    options:IMessage['pollOptions']
    messageId:string
    loggedInUserId:string
    isMutipleAnswers:boolean
    handleVoteIn: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void
    handleVoteOut: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void
}

export const PollOptionList = ({options,handleVoteIn,isMutipleAnswers,handleVoteOut,messageId,loggedInUserId}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            options?.map((option,index)=>(
                <PollOptionCard
                  isMutipleAnswers={isMutipleAnswers}
                  totalOptions={options}
                  loggedInUserId={loggedInUserId}
                  key={index}
                  index={index}
                  option={option}
                  messageId={messageId}
                  handleVoteIn={handleVoteIn}
                  handleVoteOut={handleVoteOut}
                />
            ))
        }
    </div>
  )
}
