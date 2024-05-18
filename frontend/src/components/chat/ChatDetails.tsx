import { Avatar } from "../ui/Avatar"

export const ChatDetails = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-7">
        
        <h5 className="font-medium text-xl">Chat Details</h5>
        
        <div className="flex flex-col gap-y-4 items-center">
            <Avatar imgUrl="data:image/jpeg;base64,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" height={20} width={20}/>
            <div className="flex flex-col gap-y-0 items-center">
                <h4 className="text-lg font-medium">Wrestlers ka group</h4>
                <p className="text-gray-500">7 members</p>
            </div>
        </div>

        <div className="flex flex-col gap-y-6 w-full">
            
            <div className="flex flex-col gap-y-4">

                <div className="flex items-center justify-between">

                    <div className="flex items-center">
                        <Avatar width={8} height={8} imgUrl="https://images.unsplash.com/photo-1613323593608-abc90fec84ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"/>
                        <Avatar width={8} height={8} imgUrl="https://media.istockphoto.com/id/2062559699/photo/a-mother-helps-her-little-son-carefully-cross-natural-stepping-stones-in-a-shallow-mountain.webp?b=1&s=170667a&w=0&k=20&c=7-aZgy2Drw55tHODrTowRhV48W602tFSeY3LpQ6zK-E="/>
                        <Avatar width={8} height={8} imgUrl="https://media.istockphoto.com/id/1641017238/photo/good-vibes-only.webp?b=1&s=170667a&w=0&k=20&c=FjlLalYu8vaMVKbIkHapl37Gt3XPOVilEnzo_PmNYz8="/>
                        <Avatar width={8} height={8} imgUrl="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGltYWdlfGVufDB8fDB8fHww"/>
                    </div>

                    <p>See all</p>
                </div>

                <div className="flex items-center justify-between">
                    <p>Add member</p>
                    <p>+</p>
                </div>

                <div className="flex items-center justify-between">
                    <p>Notifications</p>
                    <p>+</p>
                </div>

            </div>

            <div className="flex items-center justify-between">
                <p>Shared media 178</p>
                <p>See all</p>
            </div>

        </div>

    </div>
  )
}
