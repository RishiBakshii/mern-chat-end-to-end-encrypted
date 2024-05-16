import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useUpdateLogin } from "../../hooks/useAuth/useUpdateLogin"
import { useToast } from "../../hooks/useUI/useToast"
import { signupSchema, signupSchemaType } from "../../schemas"
import { FormInput } from "../ui/FormInput"
import { SubmitButton } from "../ui/SubmitButton"
import { AuthRedirectLink } from "./AuthRedirectLink"
import { useSignupMutation } from "../../services/api/authApi"

export const SignupForm = () => {

    const [signup,{data,isSuccess,isError,isLoading,isUninitialized,error}] = useSignupMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized})
    
    useUpdateLogin(isSuccess,data)

    const { register, handleSubmit, formState: { errors } } = useForm<signupSchemaType>({
        resolver:zodResolver(signupSchema)
    })

    const onSubmit: SubmitHandler<signupSchemaType> = (data) => {
        const {confirmPassword,...credentials}=data
        signup(credentials)
    }
    
  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>

        <div className="flex flex-col gap-y-4">

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Name" register={register("name")} error={errors.name?.message}/>
            </div>


            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Username" register={register("username")} error={errors.username?.message}/>
            </div>

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Email" register={register("email")} error={errors.email?.message}/>
            </div>

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Password" register={register("password")} error={errors.password?.message}/>
            </div>

            <div className="flex flex-col gap-y-1">
                <FormInput placeholder="Confirm Password" register={register("confirmPassword")} error={errors.confirmPassword?.message}/>
            </div>
        </div>
        
        <div className="flex flex-col gap-y-6">

            <div className="flex flex-col gap-y-2">
                <SubmitButton btnText="Signup"/>
                <p className="text-gray-400 font-light">By creating this account, you agree that you have read and accepted our Terms of Use and Privacy Policy.</p>
            </div>
            
            <AuthRedirectLink pageName="Login" text="Already a member?" to="login"/>
        
        </div>
    </form>
  )
}
