import { useEffect } from "react"
import { messaging } from "../../config/firebaseConfig"
import { getToken } from "firebase/messaging"
import { env } from "../../config/envConfig"
import { useUpdateFcmToken } from "../useAuth/useUpdateFcmToken"

export const useNotificationPermission = () => {

    const {updateFcmToken} = useUpdateFcmToken()

    const requestPermission = async()=> {

        const permission = await Notification.requestPermission()
 
        if(permission==="granted"){
            if(env && env.VITE_FIREBASE_VAPID_KEY){
                const token  = await getToken(messaging,{vapidKey:env.VITE_FIREBASE_VAPID_KEY})
                updateFcmToken({fcmToken:token})
            }
        }
     }

    useEffect(()=>{

        const permissionStatus = localStorage.getItem("notificationPermission")

        if(!permissionStatus ||  permissionStatus!=='granted'){
            if(env && env.VITE_FIREBASE_VAPID_KEY){
                requestPermission()
            }
        }

    },[env])
}
