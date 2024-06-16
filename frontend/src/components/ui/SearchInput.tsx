import { motion } from "framer-motion"
import { CrossIcon } from "./icons/CrossIcon"
import { SearchIcon } from "./icons/SearchIcon"

type PropTypes = {
  value:string
  setValue:React.Dispatch<React.SetStateAction<string>>
}

export const SearchInput = ({value,setValue}:PropTypes) => {
  return (
    <div className="flex items-center bg-secondary-dark text-text px-2 rounded-md">

        <SearchIcon/>
        <input value={value} onChange={e=>setValue(e.target.value)} className="outline-none bg-inherit w-full  px-3 py-3" type="text" placeholder="Search"/>
        
        {
          value.trim().length>0 && 
            <motion.button initial={{opacity:0,y:2}} animate={{opacity:1,y:0}} onClick={()=>setValue('')}>
              <CrossIcon/>
            </motion.button>
        }

    </div>
  )
}
