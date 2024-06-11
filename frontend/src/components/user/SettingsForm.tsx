import { useEffect, useState } from "react"
import { env } from "../../config/envConfig"
import { getToken } from "firebase/messaging"
import { messaging } from "../../config/firebaseConfig"
import { useUpdateFcmToken } from "../../hooks/useAuth/useUpdateFcmToken"
import { useLocalStorage } from "../../hooks/useUtils/useLocalStorage"
import { LocalStorageKeys } from "../../enums/localStorage"
import { useUpdateNotificationsFlag } from "../../hooks/useUser/useUpdateNotificationsFlag"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"

export const SettingsForm = () => {

    const {updateFcmToken} = useUpdateFcmToken()
    const {updateNotificationsFlag} = useUpdateNotificationsFlag()

    const loggedInUser = useAppSelector(selectLoggedInUser)

    const [notificationsEnabled,setNotificationsEnabled] = useState<boolean | undefined>(loggedInUser?.notificationsEnabled)

    useEffect(()=>{
        setNotificationsEnabled(loggedInUser?.notificationsEnabled)
    },[loggedInUser])

    const fmcTokenExists =  useLocalStorage(LocalStorageKeys.FCM_TOKEN_EXISTS)


    const handleNotificationChange = async()=>{

        if(!notificationsEnabled){

            updateNotificationsFlag({isEnabled:true})

            if(fmcTokenExists==='false'){

                const permission = await Notification.requestPermission()
    
                if(permission==='granted'){
    
                    setNotificationsEnabled(true);

                    if(env && env.VITE_FIREBASE_VAPID_KEY) {
                        try {
                            const token = await getToken(messaging, { vapidKey: env.VITE_FIREBASE_VAPID_KEY });
                            updateFcmToken({ fcmToken: token });
                            console.log("FCM token obtained and stored.");
                        } 
                        catch (error) {
                            console.error("Error obtaining FCM token:", error);
                        }
                    }
                    
                }
            }

        }

        else{
            updateNotificationsFlag({isEnabled:false})
        }
    }

  return (
    <div className="">

        <div className="flex justify-between items-center">
            <p>Notifications</p>
            <label className="inline-flex items-center cursor-pointer">
                <input onChange={handleNotificationChange} type="checkbox" checked={notificationsEnabled} className="sr-only peer"/>
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>

    </div>
  )
}
