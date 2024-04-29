import { useAppSelector } from "../../../app/hooks"
import { selectLoggedInUser } from "../../auth/authSlice"

export const Navbar = () => {

  const loggedInUser = useAppSelector(selectLoggedInUser)

  return (
    <nav className="flex items-center h-14 justify-around shadow">
      <h4 className="text-3xl font-bold">Chorus</h4>
      <img className="h-12 rounded-full aspect-square" src={loggedInUser?.avatar} alt={`${loggedInUser?.name} avatar`} />
    </nav>
  )
}
