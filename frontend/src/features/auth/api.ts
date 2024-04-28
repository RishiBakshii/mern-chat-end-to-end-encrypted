import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { IUser } from '../../interfaces/auth'
import type { IResetPassword } from '../../interfaces/auth'
import type { IOtp } from '../../interfaces/auth'
import { config } from '../../config/envConfig'

export const authApi = createApi({

    reducerPath:"authApi",
    
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/auth`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        login:builder.mutation<IUser,Pick<IUser,'email'> & {password:string}>({
            query:(credentials)=>({
                url:"/login",
                method:"POST",
                body:credentials
            })
        }),
        signup:builder.mutation<IUser,Omit<IUser,'avatar' | '_id'>>({
            query:(credentials)=>({
                url:"/signup",
                method:"POST",
                body:credentials
            })
        }),
        forgotPassword:builder.mutation<void,Pick<IUser , 'email'>>({
            query:(credentials)=>({
                url:"/forgot-password",
                method:"POST",
                body:credentials
            })
        }),
        resetPassword:builder.mutation<void,IResetPassword>({
            query:(credentials)=>({
                url:"/reset-password",
                method:"POST",
                body:credentials
            })
        }),
        verifyOtp:builder.mutation<IUser,IOtp>({
            query:(credentials)=>({
                url:"/verify-otp",
                method:"POST",
                body:credentials
            })
        }),
        sendOtp:builder.query<void,void>({
            query:()=>"/send-otp"
        }),
        logout:builder.query<void,void>({
            query:()=>"/logout"
        }),
        checkAuth:builder.query<IUser | null,void>({
            query:()=>"/check-auth"
        }),


    })
})

export const {
    useLoginMutation,
    useSignupMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyOtpMutation,
    useSendOtpQuery,
    useLogoutQuery,
    useCheckAuthQuery
} = authApi