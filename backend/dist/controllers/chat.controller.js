var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { Message } from "../models/message.model.js";
import { emitEvent, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/auth.util.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import { Types } from "mongoose";
import { UnreadMessage } from "../models/unread-message.model.js";
export const addUnreadMessagesStage = {
    $addFields: {
        unreadMessages: {
            count: 0,
            message: {
                _id: "",
                content: "",
            },
            sender: {
                _id: "",
                username: "",
                avatar: "",
            },
        },
        userTyping: (Array),
        seenBy: (Array),
    },
};
export const populateMembersStage = {
    $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
        pipeline: [
            {
                $addFields: {
                    avatar: "$avatar.secureUrl",
                },
            },
            {
                $project: {
                    username: 1,
                    avatar: 1,
                },
            },
        ],
    },
};
export const updateAvatarFeild = {
    $addFields: {
        avatar: "$avatar.secureUrl",
    },
};
const createChat = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let uploadResults = [];
    const { isGroupChat, members, avatar, name } = req.body;
    if (isGroupChat === 'true') {
        if (members.length < 2) {
            return next(new CustomError("Atleast 2 members are required to create group chat", 400));
        }
        else if (!name) {
            return next(new CustomError("name is required for creating group chat", 400));
        }
        const membersWithReqUser = [...members, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id];
        const isExistingGroupChat = yield Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
        });
        if (isExistingGroupChat) {
            return next(new CustomError("group chat already exists", 400));
        }
        if (req.file) {
            uploadResults = yield uploadFilesToCloudinary([req.file]);
        }
        const newGroupChat = yield Chat.create({
            avatar: {
                secureUrl: ((_b = uploadResults[0]) === null || _b === void 0 ? void 0 : _b.secure_url) ? uploadResults[0].secure_url : DEFAULT_AVATAR,
                publicId: ((_c = uploadResults[0]) === null || _c === void 0 ? void 0 : _c.public_id) ? uploadResults[0].public_id : null
            },
            isGroupChat,
            members: membersWithReqUser,
            admin: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
            name
        });
        const transformedChat = yield Chat.aggregate([
            {
                $match: {
                    _id: newGroupChat._id,
                },
            },
            updateAvatarFeild,
            populateMembersStage,
            addUnreadMessagesStage
        ]);
        const membersIdsInString = newGroupChat.members.map(member => member._id.toString());
        const otherMembers = getOtherMembers({ members: membersIdsInString, user: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id.toString() });
        emitEvent(req, Events.NEW_GROUP, otherMembers, transformedChat[0]);
        return res.status(201).json(transformedChat[0]);
    }
    else if (isGroupChat === 'false') {
        if (members.length > 1) {
            return next(new CustomError("normal chat cannot have more than 1 member", 400));
        }
        if (name) {
            return next(new CustomError("Name cannot be assigned to a normal chat", 400));
        }
        else if (avatar) {
            return next(new CustomError("Avatar cannot be assigned to a normal chat", 400));
        }
        const membersWithReqUser = [...members, (_f = req.user) === null || _f === void 0 ? void 0 : _f._id];
        const isExistingChat = yield Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
        });
        if (isExistingChat) {
            return next(new CustomError("Chat already exists", 400));
        }
        const normalChat = yield Chat.create({ members: [...members, (_g = req.user) === null || _g === void 0 ? void 0 : _g._id] });
        const transformedChat = yield Chat.aggregate([
            {
                $match: {
                    _id: normalChat._id
                }
            },
            populateMembersStage,
            addUnreadMessagesStage
        ]);
        const memberStringIds = normalChat.members.map(member => member._id.toString());
        const otherMembers = getOtherMembers({ members: memberStringIds, user: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id.toString() });
        emitEvent(req, Events.NEW_GROUP, otherMembers, transformedChat);
        return res.status(201).json(transformedChat);
    }
}));
const getUserChats = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    const chats = yield Chat.aggregate([
        {
            $match: {
                members: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id,
            },
        },
        updateAvatarFeild,
        populateMembersStage,
        {
            $lookup: {
                from: "unreadmessages",
                let: {
                    chatId: "$_id",
                    userId: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$chat", "$$chatId"] },
                                    { $eq: ["$user", "$$userId"] },
                                ],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            as: "sender",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: "messages",
                            localField: "message",
                            foreignField: "_id",
                            as: "message",
                            pipeline: [
                                {
                                    $project: {
                                        content: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            count: 1,
                            message: 1,
                            sender: 1,
                        },
                    },
                ],
                as: "unreadMessages",
            },
        },
        {
            $addFields: {
                unreadMessages: {
                    $arrayElemAt: ["$unreadMessages", 0],
                },
            },
        },
        {
            $addFields: {
                "unreadMessages.sender": { $arrayElemAt: ['$unreadMessages.sender', 0] },
                "unreadMessages.message": { $arrayElemAt: ['$unreadMessages.message', 0] },
                seenBy: [],
                userTyping: [],
            },
        },
        {
            $addFields: {
                "unreadMessages.sender.avatar": "$unreadMessages.sender.avatar.secureUrl"
            }
        }
    ]);
    return res.status(200).json(chats);
}));
const addMemberToChat = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m;
    const { id } = req.params;
    const { members } = req.body;
    const isExistingChat = yield Chat.findById(id);
    if (!isExistingChat) {
        return next(new CustomError("Chat does not exists", 404));
    }
    if (!isExistingChat.isGroupChat) {
        return next(new CustomError("This is not a group chat, you cannot add members", 400));
    }
    if (((_l = isExistingChat.admin) === null || _l === void 0 ? void 0 : _l._id.toString()) !== ((_m = req.user) === null || _m === void 0 ? void 0 : _m._id.toString())) {
        return next(new CustomError("You are not allowed to add members as you are not the admin of this chat", 400));
    }
    const validMembers = yield User.aggregate([
        {
            $match: {
                _id: { $in: members.map(member => new Types.ObjectId(member)) }
            }
        },
        updateAvatarFeild,
        {
            $project: {
                username: 1,
                avatar: 1
            }
        }
    ]);
    const existingMembers = validMembers.filter(validMember => isExistingChat.members.includes(new Types.ObjectId(validMember._id)));
    if (existingMembers.length) {
        return next(new CustomError(`${existingMembers.map(member => `${member.username}`)} already exists in members of this chat`, 400));
    }
    isExistingChat.members.push(...validMembers.map(member => new Types.ObjectId(member._id)));
    yield isExistingChat.save();
    // Extract old members
    const newMemberIdsSet = new Set(members);
    const oldMembers = isExistingChat.members.filter(member => !newMemberIdsSet.has(member.toString()));
    const oldMemberIds = oldMembers.map(member => member._id.toString());
    emitEvent(req, Events.NEW_MEMBER_ADDED, oldMemberIds, {
        chatId: isExistingChat._id,
        members: validMembers
    });
    const transformedChat = yield Chat.aggregate([
        {
            $match: {
                _id: isExistingChat._id
            }
        },
        updateAvatarFeild,
        populateMembersStage,
        addUnreadMessagesStage
    ]);
    emitEvent(req, Events.NEW_GROUP, members, transformedChat[0]);
    res.status(200).json(validMembers);
}));
const removeMemberFromChat = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p, _q;
    const { id } = req.params;
    const { members } = req.body;
    const isExistingChat = yield Chat.findById(id);
    if (!isExistingChat) {
        return next(new CustomError("Chat does not exists", 404));
    }
    if (!isExistingChat.isGroupChat) {
        return next(new CustomError("This is not a group chat, you cannot remove members", 400));
    }
    if (((_o = req.user) === null || _o === void 0 ? void 0 : _o._id.toString()) !== ((_p = isExistingChat.admin) === null || _p === void 0 ? void 0 : _p._id.toString())) {
        return next(new CustomError("You are not allowed to remove members as you are not the admin of this chat", 400));
    }
    const existingChatMemberIds = isExistingChat.members.map(member => member._id.toString());
    const invalidMemberIds = members.filter(member => !existingChatMemberIds.includes(member));
    if (invalidMemberIds.length) {
        return next(new CustomError("Please provide valid members to remove", 400));
    }
    if (isExistingChat.members.length === 3) {
        const publicIdsToBeDestroyed = [];
        if ((_q = isExistingChat.avatar) === null || _q === void 0 ? void 0 : _q.publicId) {
            publicIdsToBeDestroyed.push(isExistingChat.avatar.publicId);
        }
        const messageWithAttachements = yield Message.find({ chat: isExistingChat._id, attachments: { $ne: [] } });
        messageWithAttachements.forEach(message => {
            var _a;
            if ((_a = message.attachments) === null || _a === void 0 ? void 0 : _a.length) {
                const attachmentsPublicId = message.attachments.map(attachment => attachment.publicId);
                publicIdsToBeDestroyed.push(...attachmentsPublicId);
            }
        });
        const chatDeletePromise = [
            isExistingChat.deleteOne(),
            Message.deleteMany({ chat: isExistingChat._id }),
            UnreadMessage.deleteMany({ chat: isExistingChat._id }),
            deleteFilesFromCloudinary(publicIdsToBeDestroyed)
        ];
        yield Promise.all(chatDeletePromise);
        emitEvent(req, Events.DELETE_CHAT, existingChatMemberIds, { chatId: isExistingChat._id });
        return res.status(200).json();
    }
    const isAdminLeavingIndex = members.findIndex(member => { var _a; return ((_a = isExistingChat.admin) === null || _a === void 0 ? void 0 : _a._id.toString()) === member; });
    if (isAdminLeavingIndex !== -1) {
        isExistingChat.admin = isExistingChat.members[0];
    }
    isExistingChat.members = isExistingChat.members.filter(existingMember => !members.includes(existingMember._id.toString()));
    yield isExistingChat.save();
    emitEvent(req, Events.DELETE_CHAT, members, { chatId: isExistingChat._id });
    emitEvent(req, Events.MEMBER_REMOVED, existingChatMemberIds.filter(id => !members.includes(id)), { chatId: isExistingChat._id, membersId: members });
    return res.status(200).json();
}));
export { addMemberToChat, createChat, getUserChats, removeMemberFromChat };
//# sourceMappingURL=chat.controller.js.map