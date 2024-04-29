
export const ChatItem = () => {
  return (
    <div className="flex items-center gap-x-3 hover:bg-gray-100 hover:cursor-pointer">

        <img className="aspect-square w-16 rounded-md object-cover" src={`https://source.unsplash.com/random/?face$${Math.floor(Math.random() * 100) }`} alt="" />

        <div className="w-full">
            <div className="flex justify-between items-center">
                <p className="font-medium">Chat Name</p>
                <p  className="text-sm text-gray-500">{1}m</p>
            </div>
            <p className="text-sm text-gray-500">Latest message</p>
        </div>

    </div>
  )
}
