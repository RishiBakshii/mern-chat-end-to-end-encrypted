import { ICallInRequestEventReceiveData, IJoinedChat } from "../callIn"
import { IMessage } from "../messages"

export interface IUi {
    isDarkMode:boolean
    navMenu:boolean,
    newgroupChatForm:boolean
    addMemberForm:boolean
    addFriendForm:boolean
    friendRequestForm:boolean
    profileForm:boolean
    removeMemberForm:boolean
    gifForm:boolean
    attachments:Array<string>
    chatBar:boolean
    chatDetailsBar:boolean
    pollForm:boolean
    viewVotes:boolean
    votesData:Pick<IMessage, 'pollQuestion' | 'pollOptions'> | null
    chatUpdateForm:boolean
    callInForm:boolean
    callInRequests:Array<ICallInRequestEventReceiveData>
    callInRequestDisplay:boolean
    joinedChats:Array<IJoinedChat>
    activeJoinedChat:string | null
    callOutForm:boolean
    recoverPrivateKeyForm:boolean
    settingsForm:boolean
    notificationPermissionForm:boolean
}