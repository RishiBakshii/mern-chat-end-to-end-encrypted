import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, resetPasswordSchemaType } from "../../schemas/auth"
import { FormInput } from "../ui/FormInput"
import { useForm, SubmitHandler } from "react-hook-form"
import { useResetPassword } from "../../hooks/useAuth/useResetPassword"

type PropTypes = {
    token:string,
    user:string
}

export const ResetPasswordForm = ({token,user}:PropTypes) => {

    const { register, handleSubmit, formState: { errors } } = useForm<resetPasswordSchemaType>({resolver:zodResolver(resetPasswordSchema)})

    const {resetPassword,isLoading} = useResetPassword()

    const onSubmit: SubmitHandler<resetPasswordSchemaType> = ({newPassword}) => {

        resetPassword({newPassword,token,userId:user})        
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormInput
          type="password"
          placeholder="New password"
          register={{...register("newPassword")}}
          error={errors.newPassword?.message}
          />
        <FormInput
          type="password"
          placeholder="Confirm new password"
          register={{...register("confirmPassword")}}
          error={errors.confirmPassword?.message}
          />
        <button disabled={isLoading} type="submit" className="bg-primary px-6 py-2 rounded-sm">Update password</button>
    </form>
  )
}
