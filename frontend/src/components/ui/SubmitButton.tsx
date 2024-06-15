
type PropTypes = {
    btnText:string
    disabled?:boolean
}

export const SubmitButton = ({btnText,disabled=false}:PropTypes) => {
  return (
    <button disabled={disabled} type="submit" className="w-full bg-primary text-white px-6 py-3 rounded shadow-lg font-medium">{btnText}</button>
  )
}
