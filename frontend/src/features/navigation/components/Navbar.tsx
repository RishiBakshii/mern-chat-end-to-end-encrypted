import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { useLazyLogoutQuery } from "../../auth/api"
import { logout, selectLoggedInUser } from "../../auth/authSlice"
import { selectNavMenu, setNavMenu, setNewgroupChatForm } from "../../ui/uiSlice"

export const Navbar = () => {

  const dispatch = useAppDispatch()
  const isNavMenuOpen = useAppSelector(selectNavMenu)

  const [logoutQueryTrigger,{}] = useLazyLogoutQuery()

  const toggleNavMenu = ()=>{
    dispatch(setNavMenu(!isNavMenuOpen))
  }

  const openNewGroupChatForm = ()=>{
    dispatch(setNavMenu(false))
    dispatch(setNewgroupChatForm(true))
  }

  const logoutUser = () =>{
    logoutQueryTrigger()
    dispatch(logout())
  }

  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <nav className="flex items-center h-14 justify-around shadow">
      <h4 className="text-3xl font-bold">Chorus</h4>
      <div className="relative">
          <img onClick={toggleNavMenu} className="h-12 rounded-full aspect-square cursor-pointer object-cover" src={loggedInUser?.avatar} alt={`${loggedInUser?.name} avatar`} />
          {
            isNavMenuOpen && <div className="bg-gray-100 w-[15rem] absolute rounded-lg shadow-2xl p-4">
              <ul>
                <li onClick={openNewGroupChatForm} className="cursor-pointer flex item-center gap-x-2 hover:bg-gray-200 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-violet-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p>New Group Chat</p>
                </li>
                <li onClick={logoutUser} className="cursor-pointer flex item-center gap-x-2 hover:bg-gray-200 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          }
      </div>
    </nav>
  )
}
