
type PropTypes = {
    btnText:string
}

export const SubmitButton = ({btnText}:PropTypes) => {
  return (
    <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded shadow-lg font-medium text-lg">{btnText}</button>
  )
}
