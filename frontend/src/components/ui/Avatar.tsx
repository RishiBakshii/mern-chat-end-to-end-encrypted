type PropTypes = {
    alt:string
    imgUrl:string
    width:number
    height:number
}

export const Avatar = ({imgUrl,alt,width,height}:PropTypes) => {
  return (
    <img className={`w-${width} h-${height} rounded-full object-cover`} src={imgUrl} alt={alt} />
  )
}
