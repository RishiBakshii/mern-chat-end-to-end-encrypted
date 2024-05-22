import { SignupForm } from "../components/auth/SignupForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const SignupPage = () => {
  return (

      <>
        <div className="flex flex-col gap-y-8">
          
          <h4 className="text-4xl font-bold text-fluid-h4">Signup</h4>

          <SocialLogin
              googleLink={`${config.base_url}/auth/google`}
              githubLink={`${config.base_url}/auth/github`}
              />
        </div>
            
        <SignupForm/>
      </>
      
  )
}
