import { getToken } from "firebase/messaging"
import { motion } from "framer-motion"
import { env } from "../../config/envConfig"
import { messaging } from "../../config/firebaseConfig"
import { useUpdateFcmToken } from "../../hooks/useAuth/useUpdateFcmToken"
import { setNotificationPermissionForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useEffect } from "react"
import { useUpdateNotificationsFlag } from "../../hooks/useUser/useUpdateNotificationsFlag"

export const NotificationPermissionForm = () => {

    const dispatch = useAppDispatch()
    const {updateFcmToken,isSuccess} = useUpdateFcmToken()

    const {updateNotificationsFlag} = useUpdateNotificationsFlag()

    useEffect(()=>{
        if(isSuccess) handleDeny()
    },[isSuccess])

    const handleDeny = ()=>{
        dispatch(setNotificationPermissionForm(false))
    }

    const handleAllow = async()=>{
            
        const permission = await Notification.requestPermission()
        
        if(permission==='granted'){

            if(env && env.VITE_FIREBASE_VAPID_KEY) {
                try {
                    const token = await getToken(messaging, { vapidKey: env.VITE_FIREBASE_VAPID_KEY });
                    updateFcmToken({ fcmToken: token });
                    updateNotificationsFlag({isEnabled:true})
                    console.log("FCM token obtained and stored.");
                } 
                catch (error) {
                    console.error("Error obtaining FCM token:", error);
                }
            }
            
        }
        else{
            handleDeny()
        }
    }

  return (
    <div className="flex flex-col gap-y-7">

        <div className="flex flex-col gap-y-2">
            <h4 className="text-xl">hmm 💭 seems like you haven't been receiving notifications</h4>
            <div className="flex flex-col gap-y-1">
                <p className="text-secondary-darker">Even after allowing notifications you'll have full control to toggle them via settings </p>
                <p className="text-secondary-darker">Wanna allow notifications ? </p>
            </div>
        </div>

        <div className="flex items-center gap-x-2">
            <motion.button whileHover={{scale:1.020}} whileTap={{scale:0.980}} onClick={handleAllow} className="bg-primary px-10 py-2 rounded-md">Allow</motion.button>
            <motion.button whileHover={{scale:1.020}} whileTap={{scale:0.980}} onClick={handleDeny} className="bg-secondary-darker px-10 py-2 rounded-md">Deny</motion.button>
        </div>
    </div>
  )
}
