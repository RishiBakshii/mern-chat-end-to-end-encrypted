import { zodResolver } from "@hookform/resolvers/zod"
import { otpVerificationSchema, otpVerificationSchemaType } from "../../schemas/auth"
import { FormInput } from "../ui/FormInput"
import { useForm, SubmitHandler } from "react-hook-form"
import { useVerifyOtp } from "../../hooks/useAuth/useVerifyOtp"

export const OtpVerificationForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<otpVerificationSchemaType>({resolver:zodResolver(otpVerificationSchema)})
    
    const {verifyOtp,isLoading} = useVerifyOtp()

    const onSubmit: SubmitHandler<otpVerificationSchemaType> = ({otp}) => {
        verifyOtp({otp:otp})
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">

        <div className="flex flex-col gap-y-2">
            <FormInput
            type="text"
            register={{...register("otp")}}
            error={errors.otp?.message}
            maxLength={4}
            placeholder="OTP"
            />

        </div>

        <button disabled={isLoading} type="submit" className="bg-primary px-6 py-2 rounded-sm">Verify OTP</button>

    </form>
  )
}

