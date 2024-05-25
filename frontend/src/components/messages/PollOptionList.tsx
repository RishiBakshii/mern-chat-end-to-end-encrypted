import { IMessage, IVoteInEventPayloadData } from "../../interfaces/messages"
import { PollOptionCard } from "./PollOptionCard"

type PropTypes = {
    options:IMessage['pollOptions']
    messageId:string
    loggedInUserId:string
    handleVoteIn: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void
    handleVoteOut: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void
}

export const PollOptionList = ({options,handleVoteIn,handleVoteOut,messageId,loggedInUserId}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            options?.map((option,index)=>(
                <PollOptionCard
                  totalOptions={options.length}
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
