export const calculateSkip  = (page:number,limit:number)=>{
    return Math.ceil((page - 1) * limit)
}