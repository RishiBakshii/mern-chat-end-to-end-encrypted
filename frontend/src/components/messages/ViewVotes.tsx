import { selectVotesData } from "../../services/redux/slices/uiSlice";
import { useAppSelector } from "../../services/redux/store/hooks";
import { Avatar } from "../ui/Avatar";

export const ViewVotes = () => {

    const votesData = useAppSelector(selectVotesData)
    console.log(votesData);

  return (
    <div className="flex flex-col gap-y-8">

        <h6 className="font-medium text-xl">{votesData?.pollQuestion}</h6>

        <div className="flex flex-col gap-y-6">

            {
                votesData?.pollOptions?.map(({option,votes},index)=>(

                    <div key={index} className="flex flex-col gap-y-4">

                        <div className="flex flex-col gap-y-1">
                            <div className="flex justify-between">
                                    <p className="text-base">{option.toString()}</p>
                                    <p>{votes.length?votes.length===1?"1 vote":`${votes.length} Votes`:"No votes"}</p>
                            </div>
                            <div className="w-full h-[1px] bg-secondary-darker"/>
                        </div>

                        <div className="flex flex-col gap-y-4 max-h-32 overflow-y-scroll">
                            {
                                votes.map(({_id,avatar,username})=>(
                                    <div key={_id} className="flex gap-x-2 items-center">
                                        <Avatar imgUrl={avatar} alt={username} height={6} width={6}/>
                                        <p>{username}</p>
                                    </div>
                                ))
                            }
                        </div>


                    </div>

                ))
            }

        </div>

    </div>
  )
}
