import { githubPng, googlePng } from "../../assets"

type PropTypes = {
    title:string,
    googleLink:string
    githubLink:string
}

export const SocialLogin = ({title,googleLink,githubLink}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-6">
        <h4 className="text-4xl font-bold">{title}</h4>
        <div className="flex items-center gap-x-2">
            <button className="px-6 py-2 outline outline-1 rounded-sm outline-gray-200 flex items-center gap-x-2 w-full">
                <img src={googlePng} className="w-7" alt="google" />
                <a href={googleLink}><p>Sign up with google</p></a>
            </button>
            <button className="px-6 py-2 outline outline-1 rounded-sm  outline-gray-200 flex items-center gap-x-2 w-full">
                <img src={githubPng} className="w-7 scale-[1.5]" alt="github" />
                <a href={githubLink}><p>Sign up with github</p></a>
            </button>
        </div>
    </div>
  )
}
