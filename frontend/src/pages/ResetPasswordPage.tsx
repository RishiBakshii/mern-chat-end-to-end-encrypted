import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm"
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const ResetPasswordPage = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const user = queryParams.get('user');

    useEffect(()=>{
        if(!token || !user){
            navigate("/auth/login")
        }
    },[token,user])

  return (
    <>
     <Helmet>
        <title>Reset Password - Baatchit</title>
        <meta name="description" content="Reset your password to regain access to your Baatchit account. Enter your new password to continue enjoying seamless communication." />
        <link rel="canonical" href={`${window.location.origin}/auth/reset-password?token=${token}&user=${user}`} />
    </Helmet>

    <div className="flex flex-col gap-y-6">

        <div className="flex flex-col gap-y-3">
            <h3 className="text-4xl text-fluid-h3 font-bold">Reset your password</h3>
            <p className="text-lg text-fluid-p">Once your password is reset you can login with your new password</p>
        </div>

        <div>
            {
                token && user && 
                <ResetPasswordForm
                    token={token}
                    user={user}
                />
            }
        </div>

    </div>
    </>
  )
}
