
type PropTypes = {
    register:any
    error?:any
    placeholder?:string
    type?:"text" | "email" | "password"
}

export const FormInput = ({register,error,placeholder,type="text"}:PropTypes) => {
  return (
    <>
    <input {...register} autoComplete="current-password" type={type} className="p-3 rounded outline outline-1 outline-gray-200 hover:outline-black" placeholder={placeholder}/>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  )
}
