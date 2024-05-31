import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import { useSetVotesData } from "../../hooks/useMessages/useSetVotesData"
import { useToggleViewVotes } from "../../hooks/useUI/useToggleViewVotes"
import { IMessage, IVoteInEventPayloadData, IVoteOutEventPayloadData } from "../../interfaces/messages"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { PollOptionList } from "./PollOptionList"

type PropTypes = {
    messageId:string
    question:string
    options:IMessage['pollOptions']
    isMutipleAnswers:boolean
}

export const PollCardForm = ({question,options,isMutipleAnswers,messageId}:PropTypes) => {

  const socket = getSocket()

  const toggleViewVotes = useToggleViewVotes()
  const setVotesData = useSetVotesData()
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const handleVoteIn = ({messageId,optionIndex}:Pick<IVoteInEventPayloadData , 'messageId' | "optionIndex">)=>{

    if(selectedChatDetails){

      const payload:IVoteInEventPayloadData = {
        chatId:selectedChatDetails._id,
        messageId,
        optionIndex
      } 
      socket?.emit(Events.VOTE_IN,payload)
    }
  }

  const handleVoteOut = ({messageId,optionIndex}:Pick<IVoteInEventPayloadData , 'messageId' | "optionIndex">)=>{

    if(selectedChatDetails){
      
      const payload:IVoteOutEventPayloadData = {
        chatId:selectedChatDetails._id,
        messageId,
        optionIndex
      } 
      socket?.emit(Events.VOTE_OUT,payload)

    }

  }

  const handleViewVotesClick  = ()=>{
    toggleViewVotes()
    setVotesData({pollQuestion:question,pollOptions:options})
  }


  return (
    <div className="flex flex-col gap-y-4 min-w-56">

        <h6 className="text-lg font-medium">{question}</h6>

        {
          loggedInUser && 
          <PollOptionList
            isMutipleAnswers={isMutipleAnswers} 
            loggedInUserId={loggedInUser._id}
            messageId={messageId}
            handleVoteIn={handleVoteIn}
            handleVoteOut={handleVoteOut}
            options={options}
          />
        }

        <button onClick={handleViewVotesClick} className="text-center">View votes</button>
    </div>
  )
}
