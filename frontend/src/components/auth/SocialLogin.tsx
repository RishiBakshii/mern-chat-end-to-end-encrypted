import { githubPng, googlePng } from "../../assets"

type PropTypes = {
    googleLink:string
    githubLink:string
}

export const SocialLogin = ({githubLink,googleLink}:PropTypes) => {

  return (
    <div className="flex items-center gap-x-2 gap-3 max-md:flex-wrap">
        <button className="px-6 py-2 outline outline-1 rounded-sm outline-secondary-dark flex items-center gap-x-2 w-full">
            <img src={googlePng} className="w-7" alt="google" />
            <a href={googleLink}><p className="text-fluid-p">Continue with google</p></a>
        </button>
        <button className="px-6 py-2 outline outline-1 rounded-sm  outline-secondary-dark flex items-center gap-x-2 w-full">
            <img src={githubPng} className="w-7 scale-[1.5] invert" alt="github" />
            <a href={githubLink} ><p className="text-fluid-p">Continue with github</p></a>
        </button>
    </div>
  )
}
