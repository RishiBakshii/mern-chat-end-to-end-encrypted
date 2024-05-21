import { LoginForm } from "../components/auth/LoginForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const LoginPage = () => {    

  return (

      <>
        <SocialLogin 
            title="Login"
            googleLink={`${config.base_url}/auth/google`}
            githubLink={`${config.base_url}/auth/github`}
            />
            
        <LoginForm/>
      </>

  )
}
