import { useEffect } from 'react';

export const useScrollToBottom = (ref:React.RefObject<HTMLDivElement>,dependency:Array<any>,delay:number) => {

    useEffect(() => {

        const container = ref.current

        setTimeout(() => {
            if(container){

                const isAtBottom = container.scrollTop === container.scrollHeight;
                
                if (isAtBottom) {
                    container.scrollTop = container.scrollHeight;
                }
                
            }
        }, delay);
    }, dependency);

    return ref;
};
