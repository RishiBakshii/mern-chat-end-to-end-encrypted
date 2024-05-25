import { IPollOption, IVoteInEventPayloadData } from "../../interfaces/messages"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    index:number
    option:IPollOption
    totalOptions:number
    messageId:string
    loggedInUserId:string
    handleVoteIn: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void  
    handleVoteOut: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void  
}

export const PollOptionCard = ({option,handleVoteIn,handleVoteOut,index,messageId,loggedInUserId,totalOptions}:PropTypes) => {

    const handleVoteClick = ()=>{
        const doesVoteExists = option.votes.findIndex(vote=>vote._id===loggedInUserId)

        if(doesVoteExists!==-1){
            handleVoteOut({messageId,optionIndex:index})
        }
        else{
            handleVoteIn({messageId,optionIndex:index})
        }

    }

    const calculateVotePercentage = ()=>{
        const percentage = option.votes.length/totalOptions * 100
        return Math.round(percentage)
    }

  return (
    <div className="flex flex-col gap-y-2 justify-center">

        <div className="flex items-center justify-between">

            <div className="flex gap-x-2">

                <button onClick={handleVoteClick}>
                    {
                        option.votes.findIndex(vote=>vote._id===loggedInUserId)!==-1
                        ?
                        <div className="bg-green-500 h-6 w-6 rounded-full "></div>
                        :
                        <div className="bg-background h-6 w-6 rounded-full outline outline-1 outline-secondary-darker"></div>
                    }
                </button>

                <p className="break-words">{option.option}</p>

            </div>
            
            <div className="flex items-center">
                {
                    option.votes.slice(0,3).map(({avatar,_id,username})=>(
                        <Avatar key={_id} imgUrl={avatar} width={6} height={6} alt={username}/>
                    ))
                }
                {
                    (option.votes.length)-3 > 0 && 
                        <p className="w-8 h-8 rounded-full bg-secondary flex justify-center items-center">+{option.votes.length-3}</p>
                }
            </div>
        </div>

        <div style={{width:`${Math.min(calculateVotePercentage(), 100)}%`}} className={`h-2 bg-green-500 self-start transition-all rounded-2xl`}>
        </div>

    </div>
  )
}
