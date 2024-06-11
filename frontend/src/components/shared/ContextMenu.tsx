import { motion } from "framer-motion"

type contextOptions = {
    name:string,
    handlerFunc:()=>void
    
}

type PropTypes = {
    options:Array<contextOptions>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ContextMenu = ({options,setOpenContextMenuMessageId}:PropTypes) => {

    return (
        <motion.div variants={{hide:{opacity:0,y:-10},show:{opacity:1,y:0}}} initial="hide" exit="hide" animate="show" className={`flex flex-col bg-secondary-dark text-text p-2 right-4 top-4 rounded-2xl shadow-2xl absolute min-w-32 z-10`}>

            <button className="self-end" type="button" onClick={()=>setOpenContextMenuMessageId(undefined)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex flex-col">
                {
                    options.map(({name,handlerFunc})=>(
                        <p key={name} className="hover:bg-secondary-darker rounded-sm cursor-pointer p-2" onClick={handlerFunc}>{name}</p>
                    ))
                }
            </div>

        </motion.div>
    )
}
