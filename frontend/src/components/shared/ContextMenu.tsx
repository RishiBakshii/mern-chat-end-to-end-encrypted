import { motion } from "framer-motion"
import { EmojiPickerForm } from "../emoji/EmojiPickerForm"
import { EmojiClickData } from "emoji-picker-react"
import { forwardRef } from "react"

type contextOptions = {
    name:string,
    icon:unknown,
    handlerFunc:()=>void
    
}

type PropTypes = {
    options:Array<contextOptions>
    showReactions?:boolean
    onEmojiClick?:(e: EmojiClickData) => void
    ref:React.RefObject<HTMLDivElement>
    myMessage:boolean
}

export const ContextMenu = forwardRef<HTMLDivElement, PropTypes>(({myMessage,options,onEmojiClick,showReactions=true}:PropTypes,ref) => {
    
    return (
        <motion.div ref={ref} variants={{hide:{opacity:0},show:{opacity:1}}} initial='hide' animate="show" className={`flex flex-col gap-y-2 absolute ${myMessage?'right-0':"left-0"} z-10`}>
                {
                    showReactions &&
                    <div>
                        <EmojiPickerForm
                            onEmojiClick={onEmojiClick ?onEmojiClick:(_:EmojiClickData)=>''}
                            reactionsDefaultOpen={true}
                        />
                    </div>
                }
                
                {
                    myMessage && 
                    <div className={`flex flex-col bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl min-w-32 self-end`}>
                        
                        
                        <div className="flex flex-col">
                            {
                                options.map(({name,icon,handlerFunc})=>(
                                    <div onClick={handlerFunc} className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between">
                                        <p key={name} >{name}</p>
                                        {icon as any}
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                }
                
        </motion.div>
    )
})
