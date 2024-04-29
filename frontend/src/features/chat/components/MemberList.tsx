import { MemberItem } from "./MemberItem"

export const MemberList = () => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            Array(15).fill(0).map(_=>
                <MemberItem/>
            )
        }
    </div>
  )
}
