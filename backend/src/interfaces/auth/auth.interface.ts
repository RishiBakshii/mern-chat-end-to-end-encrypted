import { Request } from "express";
import { Socket } from "socket.io";
import { Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?:IUser
}

export interface OAuthAuthenticatedRequest extends Request {
    user?:IUser & {newUser:boolean,googleId:string}
}

export interface AuthenticatedSocket extends Socket {
    user?:IUser
}

export interface IOtp {
    hashedOtp:string
    user:Types.ObjectId
    expiresAt?:Date
}

export interface IAvatar {
    secureUrl:string,
    publicId:string
}

export interface IUser {
    _id:Types.ObjectId
    name:string
    username:string
    avatar?:IAvatar
    email:string
    isActive:boolean
    publicKey:string
    privateKey:string
    password:string
    verified?:boolean,
    createdAt?:Date
    updatedAt?:Date
    fcmToken?:string
    verificationBadge:boolean
    notificationsEnabled?:boolean
    lastSeen:Date
    oAuthSignup:boolean
    googleId:string
}

export interface ISecureInfo {
    _id: Types.ObjectId;
    name: string;
    username: string;
    avatar: string | undefined;
    email: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    verified: boolean | undefined;
    publicKey: string;
    notificationsEnabled: boolean | undefined;
    verificationBadge: boolean;
    fcmTokenExists: boolean;
    oAuthSignup:boolean
}

export interface IGithub {
    id:string
    displayName:string
    username:string
    photos:Array<{value:string}>
    _json:{email:string}
}


export interface IResetPassword {
    user:Types.ObjectId,
    hashedToken:string,
    expiresAt?:Date
}

export interface IPrivateKeyRecoveryToken {
    user:Types.ObjectId
    hashedToken:string
    expiresAt:Date
}