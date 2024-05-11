import { AvatarCard } from "./AvatarCard"

type PropTypes = {
  avatars:Array<string>
}

export const AvatarList = ({avatars}:PropTypes) => {
  return (
    <div className="flex">
      {
        avatars.map((avatar,index)=>(
          <AvatarCard key={index} avatar={avatar}/>
        ))
      }
    </div>
  )
}
