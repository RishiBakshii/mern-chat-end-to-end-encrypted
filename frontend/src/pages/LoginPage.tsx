import { Helmet } from "react-helmet-async"
import { LoginForm } from "../components/auth/LoginForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const LoginPage = () => {    

  return (

      <>

      <Helmet>
        <title>Login - Baatchit</title>
        <meta name="description" content="Login to Baatchit, your real-time chat application with seamless communication features." />
        <link rel="canonical" href={`${window.location.origin}/auth/login`} />
      </Helmet>

        <div className="flex flex-col gap-y-8">
          <h3 className="text-4xl font-bold text-fluid-h3">Login</h3>

          <SocialLogin 
              googleLink={`${config.base_url}/auth/google`}
              githubLink={`${config.base_url}/auth/github`}
              />
        </div>

        <LoginForm/>
      </>

  )
}
