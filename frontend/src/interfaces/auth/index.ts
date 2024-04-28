export interface IUser {
    _id:string
    name:string
    username:string
    avatar:string
    email:string
    verified?:boolean
}

export interface IResetPassword {
    token:string
    userId:string
    newPassword:string
}

export interface IOtp {
    otp:string
}