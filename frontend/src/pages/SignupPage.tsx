import { SignupForm } from "../components/auth/SignupForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const SignupPage = () => {
  return (

      <>
        <SocialLogin
            title="Create Account"
            googleLink={`${config.base_url}/auth/google`}
            githubLink={`${config.base_url}/auth/github`}
            />
            
        <SignupForm/>
      </>
      
  )
}
