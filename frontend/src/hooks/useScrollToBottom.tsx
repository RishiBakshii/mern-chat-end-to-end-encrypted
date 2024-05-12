import { useEffect } from 'react';

export const useScrollToBottom = (ref:React.RefObject<HTMLDivElement>,dependency:any) => {

    useEffect(() => {
        setTimeout(() => {
            if(ref.current){
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, 400);
    }, [dependency]);

    return ref;
};
