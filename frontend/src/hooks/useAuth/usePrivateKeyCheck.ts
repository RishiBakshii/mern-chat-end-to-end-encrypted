import { useEffect } from 'react';
import { getPrivateKey } from '../../utils/indexedDB';
import { useToggleRecoverPrivateKeyForm } from '../useUI/useToggleRecoverPrivateKeyForm';
import { IUser } from '../../interfaces/auth';

const usePrivateKeyCheck = (isSuccess:boolean,loggedInUser:IUser | undefined | null) => {

   const toggleRecoverPrivateKeyForm = useToggleRecoverPrivateKeyForm()

   const checkPrivateKey = async()=>{
      if(loggedInUser){
          const key = await getPrivateKey(loggedInUser._id)
          console.log('key',key);
          if(!key){
            toggleRecoverPrivateKeyForm()
          }
      }
   }

  useEffect(() => {

    if(loggedInUser && isSuccess){

      setTimeout(()=>{
        checkPrivateKey()
      },5000)

    }

  }, [isSuccess,loggedInUser]);

};

export default usePrivateKeyCheck;
