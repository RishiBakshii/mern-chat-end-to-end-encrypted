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
}