import { Outlet } from "react-router-dom"
import { Navbar } from "../features/navigation/components/Navbar"

export const RootLayout = () => {
  return (
    <>
    <header>
        <Navbar/>
    </header>
    <main className="h-[calc(100vh-3.5rem)]">
        <Outlet/>
    </main>
    </>
  )
}
