import { useEffect } from 'react';

export const useScrollToBottom = (ref:React.RefObject<HTMLDivElement>,dependency:any) => {

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dependency]);

    return ref;
};
