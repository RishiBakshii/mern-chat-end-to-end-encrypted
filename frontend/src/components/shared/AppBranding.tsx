import Lottie from "lottie-react"
import { chatAnimation } from "../../assets"
import { AvatarList } from "./AvatarList"
import { AVATARS } from "../../constants"

export const AppBranding = () => {

  return (

        <div className="text-inherit bg-inherit flex flex-col gap-y-2">

            <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-4">
                    <h2 className="text-7xl font-bold">Baatchit</h2>
                    <div className="w-20 h-20">
                        <Lottie loop={false} animationData={chatAnimation}/>
                    </div>
                </div>
                <h4 className="text-2xl font-semibold">Discover your next conversation</h4>
            </div>

            <p className="text-white-500 text-lg">Join our vibrant community of more than 1lakh+ people and build connections that last forever</p>
            
            <AvatarList avatars={AVATARS}/>

        </div>
 
  )
}
