import { useOpenRemoveMemberForm } from "../../hooks/useUI/useOpenRemoveMemberForm"

export const RemoveMemberSection = () => {

  const openRemoveMemberForm = useOpenRemoveMemberForm()

  return (
    <div className="flex items-center justify-between">
        <p>Remove member</p>
        <button onClick={openRemoveMemberForm} className="w-8 h-8 bg-red-500 rounded-full text-white hover:bg-red-600">-</button>
    </div>
  )
}
