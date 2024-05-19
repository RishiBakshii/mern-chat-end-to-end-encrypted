import { Avatar } from "./Avatar"

type PropTypes = {
    username:string,
    avatar:string
}

export const TypingCard = ({username,avatar}:PropTypes) => {
  return (
    <div className="flex item-center gap-x-1">
        <Avatar height={7} width={7} imgUrl={avatar} alt={username}/>
        <p className="text-secondary-darker">{username}</p> 
    </div>
  )
}
