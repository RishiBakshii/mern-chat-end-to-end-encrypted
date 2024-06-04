
type PropTypes = {
    attachment:string
}

export const AttachmentItem = ({attachment}:PropTypes) => {
  return (
    <img className="aspect-square object-cover" key={attachment} src={attachment} alt="attachment" />
  )
}
