type PropTypes = {
    url:string
}

export const Gif = ({url}:PropTypes) => {
  return (
    <div className="h-96 aspect-square">
        <img className="w-full h-full object-contain" src={url} alt="gif" />
    </div>
  )
}
