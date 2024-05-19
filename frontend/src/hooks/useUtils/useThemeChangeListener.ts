import { useEffect } from "react"

export const useThemeChangeListener = (callback:()=>void) => {

    useEffect(()=>{
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery?.addEventListener('change', callback);
    
        return () => {
          mediaQuery.removeEventListener('change', callback);
        };
    },[])
}
