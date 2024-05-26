var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { ACCEPTED_FILE_MIME_TYPES } from "../constants/file.constant.js";
import { Message } from "../models/message.model.js";
import { emitEvent, getOtherMembers } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { UnreadMessage } from "../models/unread-message.model.js";
import { Types } from "mongoose";
const uploadAttachment = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.length)) {
        return next(new CustomError("Please provide the files", 400));
    }
    const { chatId, memberIds } = req.body;
    if (!chatId) {
        return next(new CustomError("chatId is required", 400));
    }
    if (!memberIds.length) {
        return next(new CustomError("memberIds are required", 400));
    }
    const attachments = req.files;
    const invalidFiles = attachments.filter((file) => !ACCEPTED_FILE_MIME_TYPES.includes(file.mimetype));
    if (invalidFiles.length) {
        const invalidFileNames = invalidFiles.map(file => file.originalname).join(', ');
        return next(new CustomError(`Unsupported file types: ${invalidFileNames}`, 400));
    }
    const uploadResults = yield uploadFilesToCloudinary(attachments);
    const attachmentsArray = uploadResults.map((result) => {
        return {
            secureUrl: result.secure_url,
            publicId: result.public_id
        };
    });
    const message = yield new Message({
        chat: chatId,
        sender: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        attachments: attachmentsArray
    }).populate("sender", ['avatar', "username"]);
    yield message.save();
    const realtimeMessageResponse = {
        _id: message._id.toString(),
        chat: chatId,
        createdAt: message.createdAt,
        sender: {
            _id: message.sender._id,
            username: message.sender.username,
            avatar: message.sender.avatar.secureUrl
        },
        attachments: attachmentsArray.map(({ secureUrl }) => secureUrl),
        updatedAt: message.updatedAt
    };
    emitEvent(req, Events.MESSAGE, memberIds, realtimeMessageResponse);
    const otherMembers = getOtherMembers({ members: memberIds, user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString() });
    const updateOrCreateUnreadMessagePromise = otherMembers.map((memberId) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const isExistingUnreadMessage = yield UnreadMessage.findOne({ chat: chatId, user: memberId });
        if (isExistingUnreadMessage) {
            isExistingUnreadMessage.count ? isExistingUnreadMessage.count++ : null;
            isExistingUnreadMessage.message = message._id;
            isExistingUnreadMessage.save();
            return isExistingUnreadMessage;
        }
        return UnreadMessage.create({ chat: chatId, user: memberId, sender: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id, message: message._id });
    }));
    yield Promise.all(updateOrCreateUnreadMessagePromise);
    const unreadMessageData = {
        chatId: chatId,
        message: {
            attachments: message.attachments ? true : false
        },
        sender: {
            _id: message.sender._id,
            avatar: message.sender.avatar.secureUrl,
            username: message.sender.username
        }
    };
    emitEvent(req, Events.UNREAD_MESSAGE, memberIds, unreadMessageData);
    return res.sendStatus(201).json();
}));
const fetchAttachments = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { id } = req.params;
    const { page = 1, limit = 6 } = req.query;
    const pipelineResults = yield Message.aggregate([
        {
            $match: {
                chat: new Types.ObjectId(id),
                attachments: { $ne: [] }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $unwind: "$attachments",
        },
        {
            $group: {
                _id: "$chat",
                attachments: { $push: "$attachments.secureUrl" }
            }
        },
    ]);
    if (!pipelineResults.length) {
        return res.status(200).json({ _id: id, attachments: [], totalPages: 0 });
    }
    const result = pipelineResults[0];
    const totalPages = Math.ceil(result.attachments.length / Number(limit));
    const totalAttachments = result.attachments.length;
    result.attachments = (_e = result.attachments) === null || _e === void 0 ? void 0 : _e.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
    res.status(200).json(Object.assign(Object.assign({}, result), { totalPages, totalAttachments }));
}));
export { uploadAttachment, fetchAttachments };
//# sourceMappingURL=attachment.controller.js.map