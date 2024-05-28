
type PropTypes = {
    initialValue:boolean
    toggle: () => void
}

export const ToggleSwitch = ({initialValue,toggle}:PropTypes) => {
  return (
    <div onClick={toggle} className="bg-background w-14 h-10 rounded-lg relative p-2 cursor-pointer">
        <div className={`w-5 h-5 rounded-full absolute ${initialValue?"right-0 bg-primary":"left-0 bg-secondary-dark"} top-2`}></div>
    </div>
  )
}
