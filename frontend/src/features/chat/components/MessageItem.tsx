import { memo } from "react";

type PropTypes = {
    myMessage?:boolean;
}

export const MessageItem = memo(({myMessage=false}:PropTypes) => {
  return (
    <div className={`flex gap-x-2 ${myMessage?"self-end":""}`}>

        <img className="aspect-square object-cover w-20 self-end rounded-lg" src={`https://source.unsplash.com/random/?people$${Math.floor(Math.random() * 100)}`} alt="" />
        
        <div className={`${myMessage?"bg-violet-500 text-white":"bg-gray-200"} w-96 rounded-lg px-4 py-2 flex flex-col gap-y-1`}>
            
            {
            !myMessage && <p className="text-violet-500 font-medium">Jasmin lowrey</p>
            }
            
            <p>I added new flows to our design system, now you can use them for your projects!</p>

            <div className="flex justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-gray-400 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>
                <p className={`text-sm ${myMessage?"text-white":"text-gray-500"}`}>{new Date(Date()).toDateString()}</p>
            </div>
        </div>
    </div>
  )
})
