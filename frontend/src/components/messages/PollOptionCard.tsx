import { motion } from "framer-motion"
import { IPollOption, IVoteInEventPayloadData } from "../../interfaces/messages"
import { Avatar } from "../ui/Avatar"

type PropTypes = {
    index:number
    option:IPollOption
    totalOptions:Array<IPollOption>
    messageId:string
    loggedInUserId:string
    isMutipleAnswers:boolean
    handleVoteIn: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void  
    handleVoteOut: ({ messageId, optionIndex }: Pick<IVoteInEventPayloadData, 'messageId' | "optionIndex">) => void  
}

export const PollOptionCard = ({option,handleVoteIn,handleVoteOut,isMutipleAnswers,index,messageId,loggedInUserId,totalOptions}:PropTypes) => {

    const handleVoteClick = ()=>{
        const doesVoteExists = option.votes.findIndex(vote=>vote._id===loggedInUserId)

        if(doesVoteExists!==-1){
            handleVoteOut({messageId,optionIndex:index})
        }
        else{
            if (!isMutipleAnswers) {
                
                for (let i = 0; i < totalOptions.length; i++) {
                    const currentOption = totalOptions[i];
                    const previousVoteIndex = currentOption.votes.findIndex(vote => vote._id === loggedInUserId);
                    if (previousVoteIndex !== -1) {
                        handleVoteOut({ messageId, optionIndex: i });
                        break;
                    }
                }
            }
    
            handleVoteIn({messageId,optionIndex:index})
        }

    }

    const calculateVotePercentage = ()=>{
        const percentage = option.votes.length/totalOptions.length * 100
        return Math.round(percentage)
    }

  return (
    <div className="flex flex-col gap-y-2 justify-center">

        <div className="flex items-center justify-between">

            <div className="flex gap-x-2">

                <motion.button whileHover={{scale:1.050}} whileTap={{scale:0.950}} onClick={handleVoteClick}>
                    {
                        option.votes.findIndex(vote=>vote._id===loggedInUserId)!==-1
                        ?
                        <div className="bg-green-500 h-6 w-6 rounded-full "></div>
                        :
                        <div className="bg-background h-6 w-6 rounded-full outline outline-1 outline-secondary-darker"></div>
                    }
                </motion.button>

                <p className="break-words">{option.option}</p>

            </div>
            
            <div className="flex items-center">
                {
                    option.votes.slice(0,3).map(({avatar,_id,username})=>(
                        <motion.span key={_id} initial={{x:-5,opacity:0}} animate={{x:0,opacity:1}}>
                            <Avatar imgUrl={avatar} width={6} height={6} alt={username}/>
                        </motion.span>
                    ))
                }
                {
                    (option.votes.length)-3 > 0 && 
                        <p className="w-8 h-8 rounded-full bg-secondary flex justify-center items-center">+{option.votes.length-3}</p>
                }
            </div>
        </div>

        <div style={{width:`${Math.min(calculateVotePercentage(), 100)}%`}} className={`h-2 bg-green-500 self-start transition-all rounded-2xl`}/>

    </div>
  )
}
