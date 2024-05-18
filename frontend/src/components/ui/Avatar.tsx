type PropTypes = {
    alt:string
    imgUrl:string
    width:number
    height:number
    mr?:number
    ml?:number
}

export const Avatar = ({imgUrl,alt,width,height,ml=0,mr=0}:PropTypes) => {
  return (
    <img className={`w-${width} h-${height} ml-${ml} mr-${mr} rounded-full object-cover`} src={imgUrl} alt={alt} />
  )
}
