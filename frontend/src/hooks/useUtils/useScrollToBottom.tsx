import { useEffect } from 'react';

export const useScrollToBottom = (ref:React.RefObject<HTMLDivElement>,dependency:Array<any>,delay:number) => {

    useEffect(() => {
        setTimeout(() => {
            if(ref.current){
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, delay);
    }, dependency);

    return ref;
};
