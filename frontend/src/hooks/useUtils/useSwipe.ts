import { useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export const useSwipe = (threshold:number = 75, screenWidthThreshold:number =768,onLeftSwipe:CallableFunction,onRightSwipe:CallableFunction) => {
    
    const isTargetScreen =  useMediaQuery(screenWidthThreshold)

    const [swipe, setSwipe] = useState({
        moved: false,
        touchEnd: 0,
        touchStart: 0,
      });

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>)=>{
      e.stopPropagation()
        setSwipe(prev=> ({...prev,touchStart:e.targetTouches[0].clientX}))
    }

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>)=>{
      e.stopPropagation()
        setSwipe(prev=> ({...prev,touchEnd:e.targetTouches[0].clientX,moved:true}))
    }

    const onTouchEnd = () => {

        const distanceSwiped = swipe.touchStart - swipe.touchEnd;
    
        if (swipe.moved) {

          if (distanceSwiped > threshold) {
            onLeftSwipe();

          } 
          
          else if (distanceSwiped < -threshold) {
            onRightSwipe();
          }
          
        }
    
        setSwipe({ moved: false, touchEnd: 0, touchStart: 0 });
    };

    const emptyFunction = ()=> {}

    return {
        onTouchStart: isTargetScreen ? onTouchStart : emptyFunction,
        onTouchMove: isTargetScreen ? onTouchMove : emptyFunction,
        onTouchEnd: isTargetScreen ? onTouchEnd : emptyFunction,
      };
    

}
