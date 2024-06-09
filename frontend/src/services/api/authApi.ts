import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '../../config/envConfig'
import type { IOtp, IResetPassword, IUser } from '../../interfaces/auth'

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
        signup:builder.mutation<IUser,Omit<IUser,'avatar' | '_id' | 'createdAt' | 'updatedAt' | 'publicKey' | "lastSeen">>({
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
        verifyPassword:builder.mutation<void,{password:string}>({
            query:({password})=>({
                url:"/verify-password",
                method:"POST",
                body:{password}
            })
        }),
        verifyPrivateKeyToken:builder.mutation<{privateKey:string},{recoveryToken:string}>({
            query:({recoveryToken})=>({
                url:"/verify-privatekey-token",
                method:"POST",
                body:{recoveryToken}
            }),
        }),
        updateUserKeys:builder.mutation<Pick<IUser , 'publicKey'>,Pick<IUser , 'publicKey'> & {privateKey:string}>({
            query:({publicKey,privateKey})=>({
                url:"/user/keys",
                method:"PATCH",
                body:{publicKey,privateKey}
            })
        }),
        updateFcmToken:builder.mutation<void,{fcmToken:string}>({
            query:({fcmToken})=>({
                url:"/user/update-fcm-token",
                method:"PATCH",
                body:{fcmToken}
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
    useLazySendOtpQuery,
    useLazyLogoutQuery,
    useCheckAuthQuery,
    useUpdateUserKeysMutation,
    useVerifyPasswordMutation,
    useVerifyPrivateKeyTokenMutation,
    useUpdateFcmTokenMutation,
} = authApi