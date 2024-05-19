type PropTypes = {
    attachments:Array<string>
}

export const AttachmentList = ({attachments}:PropTypes) => {
  return (
    <div className="grid grid-cols-2 cursor-pointer bg">
        {
            attachments.map(attachment=>(
                <img  className="h-full w-full object-cover" key={attachment} src={attachment} alt="attachment" />
            ))
        }
    </div>
  )
}
