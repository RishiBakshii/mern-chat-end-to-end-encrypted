import { Outlet } from "react-router-dom"
import { AppBranding } from "../shared/AppBranding"

export const AuthLayout = () => {
  return (
    <div className="flex w-screen h-screen bg-background text-text max-xl:justify-center ">

        <div className="flex-auto flex justify-center items-center p-4 max-xl:hidden">
            <AppBranding/>
        </div>

        <div  className="w-[50rem] px-4 flex flex-col gap-y-14 shadow-xl my-10">

            <Outlet/>

        </div>
    </div>
  )
}
