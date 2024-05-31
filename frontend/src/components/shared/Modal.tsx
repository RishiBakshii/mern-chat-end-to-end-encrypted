import { createPortal } from "react-dom"
import { useAppSelector } from "../../services/redux/store/hooks"
import { selectisDarkMode } from "../../services/redux/slices/uiSlice"
import {motion} from 'framer-motion'

type PropTypes  = {
    onClose:()=>void
    isOpen:boolean
    children:React.ReactNode
    width?:number
    height?:number
}

export const Modal = ({isOpen=false,onClose,children,height}:PropTypes) => {

  const isDarkMode = useAppSelector(selectisDarkMode)

  return (
    isOpen ? 
    createPortal(
    <div onClick={onClose} className="z-50 bg-black bg-opacity-15 w-screen h-screen absolute flex items-center justify-center text-text bg-background">
        <motion.div initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} onClick={e=>e.stopPropagation()} className={`min-w-[30rem] max-sm:w-[90%] max-sm:min-w-[auto] h-[${height}rem] rounded-lg p-4 shadow-xl ${isDarkMode?"bg-secondary-dark":"bg-secondary"}`}>
            {children}
        </motion.div>
    </div>,
    document.getElementById("overlays") as HTMLElement
    ):null
  )
}
