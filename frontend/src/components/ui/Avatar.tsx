type PropTypes = {
    alt:string
    imgUrl:string
    width:number
    height:number
    mr?:number
    ml?:number

    cursor?:"pointer" | "auto"
    onClick?:()=>void
}

export const Avatar = ({imgUrl,alt,width,height,ml=0,mr=0,cursor='auto',onClick}:PropTypes) => {
  return (
    <img onClick={onClick} className={`w-${width} h-${height} ml-${ml} mr-${mr} cursor-${cursor} rounded-full object-cover shrink-0`} src={imgUrl} alt={alt} />
  )
}
