import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useSendPrivateKeyRecoveryEmail } from '../../hooks/useAuth/useSendPrivateKeyRecoveryEmail';
import { useVerifyPassword } from '../../hooks/useAuth/useVerifyPassword';
import { keyRecoverySchema, keyRecoverySchemaType } from '../../schemas/auth';
import { selectLoggedInUser } from '../../services/redux/slices/authSlice';
import { useAppSelector } from '../../services/redux/store/hooks';
import { FormInput } from '../ui/FormInput';

export const RecoverPrivateKeyForm = () => {

  const loggedInUser = useAppSelector(selectLoggedInUser)
  const {sendPrivateKeyRecoveryEmail} = useSendPrivateKeyRecoveryEmail()

  const { register, handleSubmit,watch ,formState: { errors }} = useForm<keyRecoverySchemaType>({resolver:zodResolver(keyRecoverySchema)})

  const {verifyPassword,isLoading,isSuccess} = useVerifyPassword()

  const passwordRef = watch("password")


  useEffect(()=>{
    if(isSuccess) localStorage.setItem("tempPassRef",passwordRef)
  },[isSuccess])

  const onSubmit: SubmitHandler<keyRecoverySchemaType> = ({password}) => {
    verifyPassword({password})
  }





  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">

        <div className='flex flex-col gap-y-4'>

            <h2 className="text-xl font-bold">Recover Your Private Key</h2>

            <p>
              {
                loggedInUser?.oAuthSignup ? 
                "It looks like we've detected that your private key is missing. Don't worry, you can easily recover it by verifying your email. Simply click the button below to initiate the recovery process. You will receive a verification email shortly. Please click on the verify button in that email. Once verified, we will restore your private key, and you'll be back to normal in no time."
                :
                "It looks like we've detected that your private key is missing. Don't worry, you can easily recover it by entering your account password. After entering your correct password, you will receive a verification email. Please click on the verify button in that email. Once verified, we will restore your private key, and you'll be back to normal in no time."
              }
            </p>

        </div>
        
        {
          !loggedInUser?.oAuthSignup && 
          <div className='flex flex-col gap-y-2'>
              <FormInput
              register={{...register("password")}}
              autoComplete='current-password'
              placeholder='Password'
              error={errors.password?.message}
              />
          </div>
        }
        
        <button onClick={()=>loggedInUser?.oAuthSignup?sendPrivateKeyRecoveryEmail():null} disabled={isLoading} type='submit' className='bg-primary px-12 py-2 self-center rounded-sm'>{loggedInUser?.oAuthSignup?"Initiate private key recovery":"Submit"}</button>


    </form>
  );
};
