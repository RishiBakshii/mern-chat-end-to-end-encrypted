import { FormInput } from "../ui/FormInput"
import { useForm, SubmitHandler } from "react-hook-form"
import { forgotPasswordSchema, type forgotPasswordSchemaType } from "../../schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForgotPassword } from "../../hooks/useAuth/useForgotPassword"

export const ForgotPasswordForm = () => {

    const { register, handleSubmit,formState: { errors } ,setValue} = useForm<forgotPasswordSchemaType>({resolver:zodResolver(forgotPasswordSchema)})

    const {forgotPassword,isLoading} = useForgotPassword()

    const onSubmit: SubmitHandler<forgotPasswordSchemaType> = ({email})=>{

        forgotPassword({email})
        setValue("email",'')
    }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormInput
          placeholder="Registered email"
          register={{...register("email")}}
          error={errors.email?.message}
          />
        <button disabled={isLoading} type="submit" className="bg-primary px-6 py-2 rounded-sm">Send reset link</button>
    </form>
  )
}
