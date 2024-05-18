import { Avatar } from "../ui/Avatar"

type PropTypes = {
  avatars:Array<string>
}

export const AvatarList = ({avatars}:PropTypes) => {
  return (
    <div className="flex">
      {
        avatars.map((avatar,index)=>(
          <Avatar key={index} imgUrl={avatar} alt="f" height={2} width={2}/>
        ))
      }
    </div>
  )
}
