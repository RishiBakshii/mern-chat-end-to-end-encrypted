import { messaging } from "../config/firebase.config.js";
import { notificationTitles } from "../constants/notification-title.contant.js";


export const calculateSkip  = (page:number,limit:number)=>{
    return Math.ceil((page - 1) * limit)
}

export const getRandomIndex=(length: number): number =>{
    return Math.floor(Math.random() * length);
}

export const sendPushNotification = ({fcmToken,body}:{fcmToken:string,body:string})=>{

    try {
        
        messaging.send({
            data:{
                click_action:"OPEN_APP",
            },
            token:fcmToken,
            notification:{
                // imageUrl:socket.user?.avatar?.secureUrl,
                title:`${notificationTitles[getRandomIndex(notificationTitles.length)]}`,
                body,
            },
        })
    } catch (error) {
        console.log("error")
    }
}