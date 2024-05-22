import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useUpdateLogin } from "../../hooks/useAuth/useUpdateLogin"
import { useToast } from "../../hooks/useUI/useToast"
import { loginSchema, loginSchemaType } from "../../schemas"
import { FormInput } from "../ui/FormInput"
import { SubmitButton } from "../ui/SubmitButton"
import { AuthRedirectLink } from "./AuthRedirectLink"
import { useLoginMutation } from "../../services/api/authApi"

export const LoginForm = () => {

    const [login,{data,isSuccess,isError,isLoading,isUninitialized,error}] = useLoginMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized})
    
    useUpdateLogin(isSuccess,data)

    const { register, handleSubmit, formState: { errors } } = useForm<loginSchemaType>({
        resolver:zodResolver(loginSchema)
    })

    const onSubmit: SubmitHandler<loginSchemaType> = (data) => {
        login(data)
    }
    
  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>

        <div className="flex flex-col gap-y-4">

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Email" register={register("email")} error={errors.email?.message}/>
            </div>

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Password" register={register("password")} error={errors.password?.message}/>
            </div>
        </div>
        
        <div className="flex flex-col gap-y-6">

            <div className="flex flex-col gap-y-2">
                <SubmitButton btnText="Login"/>
            </div>
            
            <div className="flex justify-between items-center flex-wrap gap-1">
                <AuthRedirectLink pageName="Signup" text="Already a member?" to="auth/signup"/>
                <AuthRedirectLink pageName="forgot password" text="Need Help?" to="auth/forgot-password"/>
            </div>
        
        </div>
    </form>
  )
}
