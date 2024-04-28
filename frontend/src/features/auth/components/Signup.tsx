import Lottie from "lottie-react"
import { Link } from "react-router-dom"
import { chatAnimation, githubPng, googlePng } from "../../../assets"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../../../schemas"
import type { signupSchemaType } from "../../../schemas"
import { useSignupMutation } from "../api"

export const Signup = () => {

    const [signup,{}] = useSignupMutation()

    const { register, handleSubmit, formState: { errors } } = useForm<signupSchemaType>({
        resolver:zodResolver(signupSchema)
    })

    const onSubmit: SubmitHandler<signupSchemaType> = (data) => {
        const {confirmPassword,...credentials}=data
        signup(credentials)
    }
    
  return (
    <div className="w-screen h-screen flex">

            {/* left */}
            <div className="flex-auto flex justify-center items-center p-4">

                    <div className="text-black flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <div className="flex items-center gap-x-4">
                                <h2 className="text-7xl font-bold">Chorus</h2>
                                <div className="w-20 h-20">
                                    <Lottie loop={false} animationData={chatAnimation}/>
                                </div>
                            </div>
                            <h4 className="text-2xl font-semibold ">Discover your next conversation</h4>
                        </div>
                        <p className="text-white-500 text-lg">Join our vibrant community of more than 1lakh+ people and build connections that last forever</p>
                        <div className="flex">
                            <img className="w-20 h-20 rounded-full object-cover" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                            <img className="w-20 h-20 rounded-full object-cover" src="https://images.pexels.com/photos/1204612/pexels-photo-1204612.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                            <img className="w-20 h-20 rounded-full object-cover" src="https://images.pexels.com/photos/2115681/pexels-photo-2115681.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                            <img className="w-20 h-20 rounded-full object-cover" src="https://images.pexels.com/photos/10506369/pexels-photo-10506369.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        </div>
                    </div>

            </div>

            {/* right */}
            <div className="w-[50rem] bg-white flex justify-center shadow-xl">


                <div className="w-[40rem] mt-12 flex flex-col gap-y-5">

                    <div className="flex flex-col  gap-y-8">
                        <h4 className="text-4xl font-bold">Create Account</h4>
                        <div className="flex items-center gap-x-2">
                            <button className="px-6 py-2 outline outline-1 rounded-sm outline-gray-200 flex items-center gap-x-2 w-full">
                                <img src={googlePng} className="w-7" alt="google" />
                                <p>Sign up with google</p>
                            </button>
                            <button className="px-6 py-2 outline outline-1 rounded-sm  outline-gray-200 flex items-center gap-x-2 w-full">
                                <img src={githubPng} className="w-7 scale-[1.5]" alt="github" />
                                <p>Sign up with github</p>
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-center text-2xl">or</p>

                    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="flex flex-col gap-y-4">

                            <div className="flex flex-col gap-y-1">
                                <input {...register("name")} className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" type="text" placeholder="Name"/>
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>


                            <div className="flex flex-col gap-y-1">
                                <input {...register("username")} className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" type="text" placeholder="Username"/>
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <input {...register("email")} className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" placeholder="Email"/>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <input {...register("password")}  className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" type="password" placeholder="Password" />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div className="flex flex-col gap-y-1">
                                <input {...register("confirmPassword")} className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" type="password" placeholder="Confirm Password"/>
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-y-6">

                            <div className="flex flex-col gap-y-2">
                                <button type="submit" className="w-full bg-violet-500 text-white px-6 py-3 rounded shadow-lg font-medium text-lg">Create Account</button>
                                <p className="text-gray-400 font-light">By creating this account, you agree that you have read and accepted our Terms of Use and Privacy Policy.</p>
                            </div>
                            
                            <p>Already have an account?
                                <span className="text-violet-500 font-medium cursor-pointer ml-1">
                                <Link to='/login'>
                                    Log In
                                </Link>
                                </span>
                            </p>
                        
                        </div>
                    </form>

            </div>
            </div>

    </div>
  )
}
