import { Helmet } from "react-helmet-async"
import { SignupForm } from "../components/auth/SignupForm"
import { SocialLogin } from "../components/auth/SocialLogin"
import { config } from "../config/envConfig"

export const SignupPage = () => {
  return (

      <>

      <Helmet>
        <title>Signup - Baatchit</title>
        <meta name="description" content="Signup to Baatchit, your real-time chat application with seamless communication features." />
        <link rel="canonical" href={`${window.location.origin}/auth/signup`} />
      </Helmet>

        <div className="flex flex-col gap-y-8">
          
          <h3 className="text-4xl font-bold text-fluid-h4">Signup</h3>
          {/* <PreReleaseHeader/> */}

          <SocialLogin
              googleLink={`${config.base_url}/auth/google`}
              githubLink={`${config.base_url}/auth/github`}
              />
        </div>
            
        <SignupForm/>
      </>
      
  )
}
