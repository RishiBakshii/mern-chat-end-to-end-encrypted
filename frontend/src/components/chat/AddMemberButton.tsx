import { useOpenAddMemberForm } from "../../hooks/useUI/useOpenAddMemberForm"

export const AddMemberButton = () => {

  const openAddMemberForm = useOpenAddMemberForm()

  return (
    <div className="flex items-center justify-between">
        <p>Add member</p>
        <button onClick={openAddMemberForm} className="w-8 h-8 bg-violet-500 rounded-full text-white hover:bg-violet-600">+</button>
    </div>
  )
}
