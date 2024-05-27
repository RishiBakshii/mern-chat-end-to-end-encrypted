import { useEffect, useRef, useState } from "react";
import { IAttachment } from "../../interfaces/attachment";

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
        console.log(page);
        if(page===attachments.totalPages){
            setHasMore(false)
        }
        if(hasMore){
            fetchMoreAttachments(selectedChatId,page)
        }
    },[page,hasMore])

    const handleScroll = ()=>{
        const container = containerRef.current;

        if(container && container.scrollHeight - container.scrollTop === container.clientHeight && hasMore){
            setPage(prev=>prev+1)
        }
    }

  return (

    <div className="flex flex-col gap-y-4">

        <div className="flex items-center justify-between">
            <p>{attachments?.totalAttachments>0?"Shared media":"No shared media"} {attachments?.totalAttachments}</p>
        </div>

        <div ref={containerRef} onScroll={handleScroll} className="grid grid-cols-2 gap-4 place-items-center h-[28rem] overflow-y-scroll">
            {
                attachments.attachments.map((url,index)=>(
                    <img key={index} className="w-40 h-40 object-cover" src={url} alt={`${index}`} />
                ))
            }
        </div>

    </div>

  );
};
