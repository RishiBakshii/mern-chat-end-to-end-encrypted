import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { config } from '../../config/envConfig'
import { IUser } from '../../interfaces/auth'
import { updateLoggedInUser, updateLoggedInUserNotificationStatus } from '../redux/slices/authSlice'

export const userApi = createApi({

    reducerPath:"userApi",
    
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/user`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        searchUser:builder.query<Array<Pick<IUser,'_id' |'name' | 'username' | "avatar">>, IUser['username']>({
            query:(username)=>`/search?username=${username}`
        }),

        updateProfile:builder.mutation<IUser,{avatar:Blob}>({
            query:({avatar})=>{

                const formData = new FormData()
                formData.append("avatar",avatar)

                return {
                    url:"/",
                    method:"PATCH",
                    body:formData,
                }
            },
            async onQueryStarted({},{dispatch,queryFulfilled}){
                const {data:UpdatedUser} = await queryFulfilled
                dispatch(updateLoggedInUser(UpdatedUser))
            }
        }),

        updateNotifications:builder.mutation<Pick<IUser,'notificationsEnabled'>,{isEnabled:boolean}>({
            query:({isEnabled})=>({
                method:"PATCH",
                url:"/notifications",
                body:{isEnabled}
            }),

            async onQueryStarted({},{dispatch,queryFulfilled}){
                const {data} = await queryFulfilled
                dispatch(updateLoggedInUserNotificationStatus(data.notificationsEnabled))
            }
        })

    })
})

export const {
    useLazySearchUserQuery,
    useUpdateProfileMutation,
    useUpdateNotificationsMutation,
} = userApi