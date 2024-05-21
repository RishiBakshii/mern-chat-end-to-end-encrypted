import { OtpVerificationForm } from "../components/auth/OtpVerificationForm"
import { useSendOtp } from "../hooks/useAuth/useSendOtp"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { useAppSelector } from "../services/redux/store/hooks"

export const VerificationPage = () => {

    const loggedInUser = useAppSelector(selectLoggedInUser)
    const {sendOtp,isLoading,isSuccess} = useSendOtp()

    const handleSendOtp = ()=>{
        sendOtp()
    }

  return (
    <div className="flex flex-col  gap-y-6">

        <div className="flex flex-col gap-y-3">
            <h4 className="text-4xl font-bold">Verify your email address</h4>
            <p className="text-lg">You'll receive an otp on <span className="font-semibold">{loggedInUser?.email}</span>  that will help us verify that this email is your's</p>
        </div>

        <div className="w-[30rem]">

            {
                isSuccess ? 
                <OtpVerificationForm/>:
                <button disabled={isLoading} onClick={handleSendOtp} type="submit" className="bg-primary px-6 py-2 rounded-sm">Get OTP</button>
            }

        </div>

    </div>
  )
}
