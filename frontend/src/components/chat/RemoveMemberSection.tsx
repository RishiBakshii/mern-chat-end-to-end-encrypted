import { useToggleRemoveMemberForm } from "../../hooks/useUI/useToggleRemoveMemberForm"

export const RemoveMemberSection = () => {

  const openRemoveMemberForm = useToggleRemoveMemberForm()

  return (
    <div className="flex items-center justify-between">
        <p>Remove member</p>
        <button onClick={openRemoveMemberForm} className="w-8 h-8 flex justify-center items-center rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </button>
    </div>
  )
}
