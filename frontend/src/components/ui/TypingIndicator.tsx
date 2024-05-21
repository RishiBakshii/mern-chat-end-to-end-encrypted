import Lottie from "lottie-react"
import { typingAnimation } from "../../assets"

type PropTypes = {
  w?:number
}
export const TypingIndicator = ({w=28}:PropTypes) => {

  return (
    <div className={`w-${w}`}>
        <Lottie animationData={typingAnimation}/>
    </div>
  )
}
