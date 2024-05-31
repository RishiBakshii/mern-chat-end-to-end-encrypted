
type PropTypes = {
    value:number
}

export const Badge = ({value}:PropTypes) => {
  return (
    <span 
      className="absolute font-light text-sm top-0 -right-3 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
        {value}
    </span>
  )
}
