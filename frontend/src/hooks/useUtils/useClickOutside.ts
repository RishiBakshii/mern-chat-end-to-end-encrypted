import { useEffect, RefObject } from 'react';


export const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void) => {

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      console.log(ref.current)
      if (ref.current && !ref.current.contains(event.target as Node)) {
        console.log('tess')
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

