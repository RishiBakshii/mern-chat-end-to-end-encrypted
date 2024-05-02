import { useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import { selectLoggedInUser } from "../../auth/authSlice"

export const Navbar = () => {

  const [isOpen,setIsOpen] = useState<boolean>(false)
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const handleClose = ()=>{
    setIsOpen(false)
  }
  const handleOpen = ()=>{
    setIsOpen(true)
  }

  return (
    <nav className="flex items-center h-14 justify-around shadow">
      <h4 className="text-3xl font-bold">Chorus</h4>
      <div className="relative">
          <img onClick={()=>setIsOpen(prev=>!prev)} className="h-12 rounded-full aspect-square cursor-pointer object-cover" src={loggedInUser?.avatar} alt={`${loggedInUser?.name} avatar`} />
          {
            isOpen && <div className="bg-gray-100 w-[15rem] absolute rounded-lg shadow-2xl p-4">
              <ul>
                <li className="cursor-pointer flex item-center gap-x-2 hover:bg-gray-200 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-violet-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p>New Group Chat</p>
                </li>
              </ul>
            </div>
          }
      </div>
    </nav>
  )
}
