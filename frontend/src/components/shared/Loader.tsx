import Lottie from "lottie-react"
import { typingAnimation } from "../../assets"

export const Loader = () => {
  return (
    <div className="w-[50rem] h-screen m-auto">
        <Lottie animationData={typingAnimation}/>
    </div>
  )
}
