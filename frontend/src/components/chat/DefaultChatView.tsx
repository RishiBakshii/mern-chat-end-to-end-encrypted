import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { fishAnimation } from "../../assets"
import { LockIcon } from "../ui/icons/LockIcon"

type PropTypes = {
    onTouchEndDefault:()=>void
    onTouchStartDefault:(e: React.TouchEvent<HTMLDivElement>) => void
    onTouchMoveDefault:(e: React.TouchEvent<HTMLDivElement>) => void
}

export const DefaultChatView = ({onTouchEndDefault,onTouchMoveDefault,onTouchStartDefault}:PropTypes) => {
  return (
    <motion.div 
        onTouchEnd={onTouchEndDefault} 
        onTouchStart={onTouchStartDefault} 
        onTouchMove={onTouchMoveDefault} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} 
        className='max-w-96 mt-20  self-center justify-self-center flex flex-col justify-center items-center relative'>
    
        <div className='relative'>

            <Lottie animationData={fishAnimation} loop={false}/>

            <div className='absolute -bottom-0 flex flex-col items-center right-0 left-0 gap-y-6'>
                
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5,duration:1}} className='text-text text-xl font-light flex flex-col items-center'>
                    
                    <div className="flex items-center gap-x-1">
                        <p>End-to-end encrypted</p>
                        <LockIcon/>
                    </div>

                    <p>Private chats</p>
                </motion.div>

            </div>

        </div>

    </motion.div>
  )
}
