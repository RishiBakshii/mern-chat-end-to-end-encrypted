export interface IChatIntitalState {
    selectedChatId:string | null
}

export interface IChat {
    _id:string
    name?:string
    isGroupChat?:boolean
    members:Array<string>
    avatar?:string
    admin?:string,
}

export interface IChatWithUnreadMessages extends IChat {
    unreadMessages:{
        count?:number
        message?:{
            _id?:string,
            content?:string
        },
        sender?:{
            _id?:string,
            username?:string,
            avatar?:string
        }
    }
}