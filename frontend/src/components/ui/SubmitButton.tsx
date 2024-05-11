
type PropTypes = {
    btnText:string
}

export const SubmitButton = ({btnText}:PropTypes) => {
  return (
    <button type="submit" className="w-full bg-violet-500 text-white px-6 py-3 rounded shadow-lg font-medium text-lg">{btnText}</button>
  )
}
