import { useOpenAddMemberForm } from "../../hooks/useUI/useOpenAddMemberForm"

export const AddMemberSection = () => {

  const openAddMemberForm = useOpenAddMemberForm()

  return (
    <div className="flex items-center justify-between">
        <p>Add member</p>
        <button onClick={openAddMemberForm} className="w-8 h-8 bg-primary rounded-full text-white hover:bg-primary-dark">+</button>
    </div>
  )
}
