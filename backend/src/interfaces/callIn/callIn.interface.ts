export interface ICallInRequestEventPayloadData {
    chat:{
        chatId:string
        avatar:string
        chatName:string
    }
    callee:string
}

export interface ICallInRejectEventPayloadData {
    callerId:string
}

export interface ICallAcceptEventReceiveData {
    callerId:string
    chat:{
        chatId:string
        name:string
        avatar:string
    }
}

export interface ICallOutEventReceiveData {
    callee:{
        _id:string
        avatar:string
        username:string
    },
    chat:{
        chatId:string
        name:string
    }
}