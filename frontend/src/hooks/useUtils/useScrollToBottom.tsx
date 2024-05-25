import { useEffect } from 'react';

export const useScrollToBottom = (ref:React.RefObject<HTMLDivElement>,dependency:Array<any>) => {

    useEffect(() => {
        if(ref.current){
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, dependency);

    return ref;
};
