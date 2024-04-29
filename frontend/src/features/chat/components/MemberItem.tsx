
export const MemberItem = () => {
  return (
    <div className="flex gap-x-2 items-center hover:bg-gray-100">
        <img className="aspect-square object-cover w-[4rem] rounded" src={`https://source.unsplash.com/random/?people$${Math.floor(Math.random() * 100)}`} alt="people name" />
        <p className="font-medium text-base">People {Math.floor(Math.random() * 100)}</p>
    </div>
  )
}
