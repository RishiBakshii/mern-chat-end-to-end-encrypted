
export const ChatListSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 overflow-y-scroll scroll-smooth">

        {
          new Array(12).fill(0).map((_,index)=>(

            <div key={index} className="flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3">

            <div className="aspect-square w-16 rounded-full object-cover animate-pulse bg-gray-300"/>
            
            <div className="w-full">
    
                <div className="flex justify-between items-center">
    
                    <div className="flex items-center gap-x-2">
                        <div className="font-medium animate-pulse bg-gray-300 w-20 h-4 rounded-lg"></div>
                    </div>
    
                    <div className="flex flex-col">
                        <div className="text-sm bg-secondary  h-6 w-6 mr-2 "></div>
                    </div>
                </div>
                
                <p className="text-sm text-secondary-darker">
                  <div className="animate-pulse bg-gray-300 w-20 h-2 rounded-xl mt-2"></div>
                </p>
    
            </div>
    
        </div>
          ))
        }


    </div>
  )
}
