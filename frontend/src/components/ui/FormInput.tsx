
type PropTypes = {
    register:any
    error?:any
    placeholder?:string
    type?:"text" | "email" | "password"
    autoComplete?:React.HTMLInputAutoCompleteAttribute
}

export const FormInput = ({register,error,placeholder,autoComplete='off',type="text"}:PropTypes) => {
  return (
    <>
    <input {...register} autoComplete={autoComplete} type={type} className="p-3 rounded outline outline-1 outline-secondary-dark text-text bg-background hover:outline-primary" placeholder={placeholder}/>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  )
}
