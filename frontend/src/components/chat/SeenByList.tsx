import { IChatMember } from "../../interfaces/chat"
import { SeenByItem } from "./SeenByItem"

type PropTypes = {
    members:Array<IChatMember>
}

export const SeenByList = ({members}:PropTypes) => {
  return (
    <div className="flex item-center flex-wrap self-end gap-x-1">
      {
        members && members.map(member=>(
          <SeenByItem key={member._id}  member={member}/>
        ))
      }
    </div>
  )
}
