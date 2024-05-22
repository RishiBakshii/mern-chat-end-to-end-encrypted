import { Helmet } from "react-helmet-async"
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
    <>
    <Helmet>
        <title>Email Verification - Baatchit</title>
        <meta name="description" content="Verify your email address for Baatchit. Enter the OTP sent to your email to confirm your identity and continue using Baatchit." />
        <link rel="canonical" href={`${window.location.origin}/auth/verification`} />
    </Helmet>

    <div className="flex flex-col gap-y-6">

        <div className="flex flex-col gap-y-4">
            <h4 className="text-4xl text-fluid-h4 font-bold">Verify your email address</h4>
            <p className="text-lg text-fluid-p">You'll receive an otp on <span className="font-semibold">{loggedInUser?.email}</span>  that will help us verify that this email is your's</p>
        </div>

        <div>

            {
                isSuccess ? 
                <OtpVerificationForm/>:
                <button disabled={isLoading} onClick={handleSendOtp} type="submit" className="bg-primary px-6 py-2 rounded-sm max-sm:w-full">Get OTP</button>
            }

        </div>

    </div>
    </>
  )
}
