type PropTypes = {
    poll:boolean | undefined,
    url:boolean | undefined,
    attachments:boolean | undefined,
    content:string | undefined
}


export const RenderAppropriateUnreadMessage = ({attachments,content,poll,url}:PropTypes) => {
    return (
        poll?
        "Sent a poll"
        :
        url ? 
        "Sent a gif"
        :
        attachments ? 
        "Sent an attachment"
        :
        content?.length ?
        `${content}...`
        :
        null
      )
}
