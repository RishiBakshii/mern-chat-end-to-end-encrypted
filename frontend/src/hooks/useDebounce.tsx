import { useEffect, useState } from 'react'

export const useDebounce = (value:boolean,delay:number):[boolean, React.Dispatch<React.SetStateAction<boolean>>] => {

    const [debouncedValue, setDebouncedValue] = useState<boolean>(value);

    useEffect(()=>{
        let timeoutId:number
    
        if(debouncedValue===true){
          
          timeoutId=setTimeout(()=>{
            setDebouncedValue(false)
          },delay)
    
        }
    
        return ()=>{
          clearInterval(timeoutId)
        }
      },[debouncedValue])
    
    return [debouncedValue,setDebouncedValue]
}
