import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm"
import { useEffect } from "react";

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

    <div className="flex flex-col  gap-y-6">

        <div className="flex flex-col gap-y-3">
            <h4 className="text-4xl font-bold">Reset your password</h4>
            <p className="text-lg">Once your password is reset you can login with your new password</p>
        </div>

        <div className="w-[30rem]">
            {
                token && user && 
                <ResetPasswordForm
                    token={token}
                    user={user}
                />
            }
        </div>

    </div>
  )
}
