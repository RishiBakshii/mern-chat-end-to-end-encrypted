
type PropTypes = {
  count?:number
}

export const UserListSkeleton = ({count=5}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-1">
      {
        new Array(count).fill(0).map((_,index)=>(
          <div key={index} className="p-2 flex items-center justify-between">

                <div className="flex gap-x-2">
                    <div className="aspect-square size-10 rounded-full object-cover animate-pulse bg-gray-300"/>
                    <div className="flex flex-col">
                        <div className='h-4 mt-1 w-20 rounded-md bg-gray-300 animate-pulse'/>
                        <div className="h-3 mt-2 w-12 rounded-md bg-gray-300 animate-pulse"/>
                    </div>
                </div>
            
                <div className="p-2 bg-gray-300 rounded-full animate-pulse size-8"></div>

          </div>
        ))
      }
    </div>
  )
}
