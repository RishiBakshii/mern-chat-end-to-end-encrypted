import { Outlet } from "react-router"
import { Navbar } from "../../navigation/components/Navbar"

export const RootLayout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}
