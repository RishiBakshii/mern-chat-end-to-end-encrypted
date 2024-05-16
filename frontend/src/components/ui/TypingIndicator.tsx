import Lottie from "lottie-react"
import { typingAnimation } from "../../assets"

export const TypingIndicator = () => {

  return (
    <div className="w-28">
        <Lottie animationData={typingAnimation}/>
    </div>
  )
}
