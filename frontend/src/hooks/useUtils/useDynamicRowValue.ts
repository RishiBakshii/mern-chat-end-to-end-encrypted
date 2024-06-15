import { useMediaQuery } from "./useMediaQuery";

export const useDynamicRowValue = () => {

    const is640 = useMediaQuery(640)

    const getRowValue = (messageLength:number) => {
  
      if(is640){
  
          if(messageLength >= 150) return 4 
          if(messageLength >= 90) return 3 
          if(messageLength >= 30) return 2 
  
          else {
            return 1
          }
      }
  
      else {
        if(messageLength >= 870) {
          return 8
        }
        if(messageLength >= 750) {
          return 7
        }
        if(messageLength >= 620) {
          return 6
        }
        if(messageLength >= 500) {
          return 5
        }
        if(messageLength >= 380) {
          return 4
        }
        if(messageLength >= 250) {
          return 3
        }
        if(messageLength >= 120) {
          return 2
        }
  
        else{
          return 1
        }
      }
    };

    return {
        getRowValue
    }
}
