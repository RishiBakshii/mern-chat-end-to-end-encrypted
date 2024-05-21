import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '../../config/envConfig'
import { IFriendRequest } from '../../interfaces/request'
import { setFriendRequestForm } from '../redux/slices/uiSlice'

export const requestApi = createApi({

    reducerPath:"requestApi",
    
    baseQuery:fetchBaseQuery({
        baseUrl:`${config.base_url}/request`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        sendFriendRequest:builder.mutation<void,{receiverId:string}>({
            query:({receiverId})=>({
                url:"/",
                method:"POST",
                body:{receiver:receiverId}
            })
        }),
        getUserFriendRequests:builder.query<Array<IFriendRequest>,void>({
            query:()=>"/"
        }),
        handleFriendRequest:builder.mutation<IFriendRequest['_id'],{requestId:IFriendRequest['_id'],action: "accept" | "reject"}>({
            query:({requestId,action})=>({
                url:`/${requestId}`,
                method:"DELETE",
                body:{action},
            }),
            
            async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                  const { data: handledRequestId } = await queryFulfilled
                  dispatch(
                    requestApi.util.updateQueryData('getUserFriendRequests', undefined , (draft) => {

                      const friendRequestIndexToBeRemoved = draft.findIndex(draft=>draft._id===handledRequestId)
                    
                      if(draft.length===1){
                        dispatch(setFriendRequestForm(false))
                      }

                      if(friendRequestIndexToBeRemoved!==-1){
                          draft.splice(friendRequestIndexToBeRemoved,1)
                      }
                    })
                  )
                } catch(error) {
                    console.log(error);
                }
              },
        })

    })
})

export const {
    useSendFriendRequestMutation,
    useGetUserFriendRequestsQuery,
    useHandleFriendRequestMutation,
} = requestApi