import { Avatar } from "../ui/Avatar"

type PropTypes = {
  avatars:Array<string>
  w?:number,
  h?:number
}

export const AvatarList = ({avatars,w=16,h=16}:PropTypes) => {
  return (
    <div className="flex">
      {
        avatars.map((avatar,index)=>(
          <Avatar key={index} imgUrl={avatar} alt="user" width={w} height={h}/>
        ))
      }
    </div>
  )
}
