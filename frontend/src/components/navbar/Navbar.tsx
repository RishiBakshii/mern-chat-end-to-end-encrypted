import { useLogout } from "../../hooks/useAuth/useLogout"
import { useOpenAddFriendForm } from "../../hooks/useUI/useOpenAddFriendForm"
import { useOpenFriendRequestForm } from "../../hooks/useUI/useOpenFriendRequestForm"
import { useOpenNewGroupChatForm } from "../../hooks/useUI/useOpenNewGroupChatForm"
import { useOpenProfileForm } from "../../hooks/useUI/useOpenProfileForm"
import { useToggleNavMenu } from "../../hooks/useUI/useToggleNavMenu"
import { useGetUserFriendRequestsQuery } from "../../services/api/requestApi"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { selectNavMenu } from "../../services/redux/slices/uiSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { Avatar } from "../ui/Avatar"
import { FriendRequestButton } from "./FriendRequestButton"
import { NavMenu } from "./NavMenu"

export const Navbar = () => {


  const isNavMenuOpen = useAppSelector(selectNavMenu)

  const {data:friendRequests} = useGetUserFriendRequestsQuery()

  const toggleNavMenu = useToggleNavMenu()

  const openNewGroupChatForm = useOpenNewGroupChatForm()
  const openAddFriendForm = useOpenAddFriendForm()
  const openFriendRequestForm = useOpenFriendRequestForm()
  const openProfileForm = useOpenProfileForm()
  const logoutUser = useLogout()

  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <nav className="flex items-center h-14 justify-around shadow">

      <h4 className="text-3xl font-bold">Baatchit</h4>

      <div className="flex item-center gap-x-10">
              {
                friendRequests && friendRequests?.length>0 &&   

                <FriendRequestButton 
                 numberOfFriendRequest={friendRequests.length} 
                 openFriendRequestForm={openFriendRequestForm}
                />

              }

              <div className="relative">

                  <Avatar
                   cursor="pointer"
                   onClick={toggleNavMenu}
                   imgUrl={loggedInUser?.avatar!}
                   width={12}
                   height={12}
                   alt={`${loggedInUser?.username} avatar`}
                  />
                  
                  {
                    isNavMenuOpen && 

                    <div className="bg-gray-100 w-[15rem] absolute rounded-lg shadow-2xl p-4 z-50">

                      <NavMenu 
                       openProfileForm={openProfileForm}
                       openAddFriendForm={openAddFriendForm}
                       openNewGroupChatForm={openNewGroupChatForm}
                       logoutUser={logoutUser}
                      />

                    </div>

                  }
              </div>

      </div>
    </nav>
  )
}
