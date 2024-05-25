import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { useSetVotesData } from "../../hooks/useMessages/useSetVotesData"
import { useToggleViewVotes } from "../../hooks/useUI/useToggleViewVotes"
import { IChatWithUnreadMessages } from "../../interfaces/chat"
import { IMessage, IVoteInEventPayloadData, IVoteOutEventPayloadData } from "../../interfaces/messages"
import { PollOptionList } from "./PollOptionList"

type PropTypes = {
    messageId:string
    question:string
    options:IMessage['pollOptions']
    selectedChatDetails:IChatWithUnreadMessages
    loggedInUserId:string
}

export const PollCardForm = ({question,options,selectedChatDetails,messageId,loggedInUserId}:PropTypes) => {

  const socket = getSocket()

  const toggleViewVotes = useToggleViewVotes()
  const setVotesData = useSetVotesData()

  const handleVoteIn = ({messageId,optionIndex}:Pick<IVoteInEventPayloadData , 'messageId' | "optionIndex">)=>{

    const payload:IVoteInEventPayloadData = {
      chatId:selectedChatDetails._id,
      members:selectedChatDetails.members.map(member=>member._id),
      messageId,
      optionIndex
    } 
    socket?.emit(Events.VOTE_IN,payload)
  }

  const handleVoteOut = ({messageId,optionIndex}:Pick<IVoteInEventPayloadData , 'messageId' | "optionIndex">)=>{

    const payload:IVoteOutEventPayloadData = {
      chatId:selectedChatDetails._id,
      members:selectedChatDetails.members.map(member=>member._id),
      messageId,
      optionIndex
    } 
    socket?.emit(Events.VOTE_OUT,payload)

  }

  const handleViewVotesClick  = ()=>{
    toggleViewVotes()
    setVotesData({pollQuestion:question,pollOptions:options})
  }


  return (
    <div className="flex flex-col gap-y-4 min-w-56">

        <h6 className="text-lg font-medium">{question}</h6>

        <PollOptionList 
          loggedInUserId={loggedInUserId}
          messageId={messageId}
          handleVoteIn={handleVoteIn}
          handleVoteOut={handleVoteOut}
          options={options}
        />

        <button onClick={handleViewVotesClick} className="text-center">View votes</button>
    </div>
  )
}
