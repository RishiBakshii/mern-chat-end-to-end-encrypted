import { AppBranding } from "../components/shared/AppBranding"
import { LoginForm } from "../components/auth/LoginForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const LoginPage = () => {    
    

  return (

    <div className="flex w-screen h-screen">

            <div className="flex-auto flex justify-center items-center p-4">
                <AppBranding/>
            </div>

            <div className="w-[50rem] px-6 flex flex-col gap-y-14 shadow-xl mt-10">

                <SocialLogin 
                    title="Login"
                    googleLink={`${config.base_url}/auth/google`}
                    githubLink={`${config.base_url}/auth/github`}
                    />
                    
                <LoginForm/>
            </div>
    </div>

  )
}
