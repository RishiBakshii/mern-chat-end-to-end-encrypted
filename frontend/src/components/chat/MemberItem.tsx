import type { IChatMember } from "../../interfaces/chat"

type PropTypes = {
  member: IChatMember
  loggedInUserId:string
  chatAdminId?:string
  isRemovable?:boolean
  chatId?:string
  isGroupChat?:boolean
  removeHandler?:(chatId: string, memberId: string) => void
}
export const MemberItem = ({member,loggedInUserId,chatAdminId,isRemovable=false,removeHandler,chatId,isGroupChat}:PropTypes) => {
  return (
    <div className="flex gap-x-2 items-center hover:bg-gray-100 relative">
        <img className="aspect-square object-cover w-[4rem] rounded" 
        src={member.avatar} 
        alt={`${member.username} avatar`} />
        <div>
            <p className="font-medium text-base">
              {
                member._id===loggedInUserId?"You":member.username
              }
            </p>
            {
              chatAdminId === member._id ? 
              <p className="bg-violet-500 opacity-70 text-white px-2 rounded">Admin</p>
              : null
            }
        </div>

        {
          isGroupChat && isRemovable && removeHandler &&  chatId && 
          <button onClick={()=>removeHandler(chatId,member._id)} className="absolute right-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </button>
        }
    </div>
  )
}
