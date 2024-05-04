import { createPortal } from "react-dom"

type PropTypes  = {
    onClose:()=>void
    isOpen:boolean
    children:React.ReactNode
    width?:number
    height?:number
}

export const Modal = ({isOpen=false,onClose,children,height}:PropTypes) => {

  return (
    isOpen ? 
    createPortal(
    <div onClick={onClose} className="bg-black bg-opacity-15 w-screen h-screen absolute flex items-center justify-center">
        <div onClick={e=>e.stopPropagation()} className={`bg-white w-[30rem] h-[${height}rem] rounded-lg p-4 shadow-xl`}>
            {children}
        </div>
    </div>,
    document.getElementById("overlays") as HTMLElement
    ):null
  )
}
