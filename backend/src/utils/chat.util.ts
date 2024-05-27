import { Document, Types } from "mongoose";
import { IChat } from "../interfaces/chat/chat.interface.js";
import { Message } from "../models/message.model.js";
import { UnreadMessage } from "../models/unread-message.model.js";
import { deleteFilesFromCloudinary } from "./auth.util.js";


export const deleteChat = async(isExistingChat: Document<unknown, {}, IChat> & IChat & Required<{_id: Types.ObjectId}>)=>{

        const publicIdsToBeDestroyed:Array<string> = []

        if(isExistingChat.avatar?.publicId){
          publicIdsToBeDestroyed.push(isExistingChat.avatar.publicId)
        }

        const messageWithAttachements = await Message.find({chat:isExistingChat._id,attachments:{$ne:[]}})
        
        messageWithAttachements.forEach(message=>{

         if(message.attachments?.length){
           const attachmentsPublicId = message.attachments.map(attachment=>attachment.publicId)
           publicIdsToBeDestroyed.push(...attachmentsPublicId)
         }

        })

        const chatDeletePromise:Array<Promise<any>> = [
          isExistingChat.deleteOne(),
          Message.deleteMany({chat:isExistingChat._id}),
          UnreadMessage.deleteMany({chat:isExistingChat._id}),
          deleteFilesFromCloudinary(publicIdsToBeDestroyed)
        ]

        await Promise.all(chatDeletePromise)
}