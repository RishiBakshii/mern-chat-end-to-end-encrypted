var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Request } from "../models/request.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { addUnreadMessagesStage, populateMembersStage } from "./chat.controller.js";
import { Friend } from "../models/friend.model.js";
const requestPipeline = [
    {
        $project: {
            receiver: 0,
            updatedAt: 0
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender",
            pipeline: [
                {
                    $addFields: {
                        avatar: "$avatar.secureUrl"
                    }
                },
                {
                    $project: {
                        username: 1,
                        avatar: 1
                    }
                },
            ]
        }
    },
    {
        $addFields: {
            "sender": {
                $arrayElemAt: ["$sender", 0]
            }
        }
    }
];
const getUserRequests = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requests = yield Request.aggregate([
        {
            $match: {
                receiver: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
            }
        },
        ...requestPipeline
    ]);
    return res.status(200).json(requests);
}));
const createRequest = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const { receiver } = req.body;
    const isValidReceiverId = yield User.findById(receiver);
    if (!isValidReceiverId) {
        return next(new CustomError("Receiver not found", 404));
    }
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString()) === receiver) {
        return next(new CustomError("You cannot send a request to yourself", 400));
    }
    const isAlreadyCreated = yield Request.findOne({ receiver, sender: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id });
    if (isAlreadyCreated) {
        return next(new CustomError("Request is already sent", 400));
    }
    const doesRequestExistsFromReceiver = yield Request.findOne({ receiver: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id, sender: receiver });
    if (doesRequestExistsFromReceiver) {
        return next(new CustomError("They have already sent you a request", 400));
    }
    const areAlreadyFriends = yield Friend.findOne({ user: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id, friend: receiver });
    if (areAlreadyFriends) {
        return next(new CustomError("You are already friends"));
    }
    const newRequest = yield Request.create({ receiver, sender: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id });
    const transformedRequest = yield Request.aggregate([
        {
            $match: {
                _id: newRequest._id
            }
        },
        ...requestPipeline
    ]);
    emitEvent(req, Events.NEW_FRIEND_REQUEST, [receiver], transformedRequest[0]);
    return res.status(201).json();
}));
const handleRequest = asyncErrorHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { id } = req.params;
    const { action } = req.body;
    const isExistingRequest = yield Request.findById(id);
    if (!isExistingRequest) {
        return next(new CustomError("Request not found", 404));
    }
    if (isExistingRequest.receiver._id.toString() !== ((_g = req.user) === null || _g === void 0 ? void 0 : _g._id.toString())) {
        return next(new CustomError("Only the receiver of this request can accept or reject it", 401));
    }
    if (action === 'accept') {
        const members = [isExistingRequest.sender, isExistingRequest.receiver];
        const newChat = yield Chat.create({ members });
        const friends = yield Friend.insertMany([
            { user: isExistingRequest.receiver, friend: isExistingRequest.sender },
            { user: isExistingRequest.sender, friend: isExistingRequest.receiver }
        ]);
        const transformedChat = yield Chat.aggregate([
            {
                $match: {
                    _id: newChat._id
                }
            },
            populateMembersStage,
            addUnreadMessagesStage
        ]);
        const membersStringIds = [isExistingRequest.sender.toString(), isExistingRequest.receiver.toString()];
        emitEvent(req, Events.NEW_GROUP, membersStringIds, transformedChat[0]);
        yield isExistingRequest.deleteOne();
        return res.status(200).json(isExistingRequest._id);
    }
    else if (action === 'reject') {
        yield isExistingRequest.deleteOne();
        return res.status(200).json(isExistingRequest._id);
    }
}));
export { getUserRequests, createRequest, handleRequest };
//# sourceMappingURL=request.controller.js.map