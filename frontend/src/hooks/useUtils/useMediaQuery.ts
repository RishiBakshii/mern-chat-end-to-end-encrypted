import { useEffect, useState } from 'react';

export const useMediaQuery = (number:number) => {

    const query  = `(max-width:${number -1 }px)`

    const [isMatches,setIsMatches] = useState<boolean>(()=>window.matchMedia(query).matches)

    useEffect(() => {

        const mediaQuery = window.matchMedia(query);
        
        const handleMediaQueryChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setIsMatches(event.matches)
        };
    
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };


    }, [query]);

    return isMatches

};

