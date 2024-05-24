import { useEffect } from "react";

export const useInfiniteScroll = (ref:React.RefObject<HTMLDivElement>,handler:()=>any) => {

    useEffect(() => {
        const container = ref.current;
    
        if (!container) return;
    
        const handleScroll = () => {
          if (container.scrollHeight - container.scrollTop === container.clientHeight) {
            handler();
          }
        };
    
        container.addEventListener('scroll', handleScroll);
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }, [ref, handler]);
}
