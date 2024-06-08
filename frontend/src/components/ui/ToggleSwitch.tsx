
type PropTypes = {
    initialValue:boolean
    toggle: () => void
}

export const ToggleSwitch = ({initialValue,toggle}:PropTypes) => {
  return (
    <>
    <label className="inline-flex items-center cursor-pointer">
      <input onClick={toggle} type="checkbox" checked={initialValue} className="sr-only peer"/>
      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
    </>
  )
}
