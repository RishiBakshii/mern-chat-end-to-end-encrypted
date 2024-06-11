export interface IUser {
    _id:string
    name:string
    username:string
    avatar:string
    email:string
    publicKey:string
    createdAt:Date
    updatedAt:Date
    verified?:boolean
    notificationsEnabled:boolean
    lastSeen:Date
}

export interface IAuth {
    loggedInUser:IUser | null
}

export interface IResetPassword {
    token:string
    userId:string
    newPassword:string
}

export interface IOtp {
    otp:string
}