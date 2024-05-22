import { Helmet } from "react-helmet-async"
import { AuthRedirectLink } from "../components/auth/AuthRedirectLink"
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm"


export const ForgotPasswordPage = () => {
  return (
    <>
    <Helmet>
        <title>Forgot Password - Baatchit</title>
        <meta name="description" content="Reset your Baatchit password quickly and easily. Receive a reset link if your email is registered with us." />
        <link rel="canonical" href={`${window.location.origin}/auth/forgot-password`} />
    </Helmet>

    <div className="flex flex-col gap-y-6">

        <div className="flex flex-col gap-y-3">
            <h3 className="text-4xl text-fluid-h3 font-bold">Let us help you</h3>
            <p className="text-lg text-fluid-p">You'll receive a password reset link if your email is registered with us</p>
        </div>

        <div>
            <ForgotPasswordForm/>
        </div>

        <AuthRedirectLink
          pageName="Login"
          text="Go back?"
          to="auth/login"
        />
    </div>
    </>

  )
}
