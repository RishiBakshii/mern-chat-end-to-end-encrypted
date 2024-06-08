import { useEffect, useRef, useState } from "react";
import { IAttachment } from "../../interfaces/attachment";
import { CircleLoading } from "../shared/CircleLoading";

type PropTypes = {
    attachments:IAttachment
    selectedChatId:string
    fetchMoreAttachments: (chatId: string, page: number) => void
}

export const SharedMedia = ({attachments,selectedChatId,fetchMoreAttachments}:PropTypes) => {

    const [page,setPage] = useState(1) 
    const [hasMore,setHasMore] = useState<boolean>(true)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(page===attachments.totalPages){
            setHasMore(false)
        }
        if(hasMore){
            fetchMoreAttachments(selectedChatId,page)
        }
    },[page,hasMore])

    const handleScroll = ()=>{
        const container = containerRef.current;
        
        if(container){

            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 120;

            if(isAtBottom && hasMore){
                setPage(prev=>prev+1)
            }

        }

    }

  return (

    <div className="flex flex-col gap-y-4">

        <div className="flex items-center justify-between">
            <p>{attachments?.totalAttachments>0?"Shared media":"No shared media"} {attachments?.totalAttachments}</p>
        </div>

        <div ref={containerRef} onScroll={handleScroll} className="grid grid-cols-2 gap-4 place-items-center h-[28rem] overflow-y-auto">
            {
                attachments.attachments.map((url,index)=>(
                    <img key={index} className="w-40 h-40 object-cover" src={url} alt={`${index}`} />
                ))
            }
        </div>

    </div>

  );
};
