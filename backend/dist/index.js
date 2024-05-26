var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import passport from 'passport';
import { Server } from 'socket.io';
import './config/cloudinary.config.js';
import { connectDB } from './config/db.config.js';
import { config } from './config/env.config.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import './passport/github.strategy.js';
import './passport/google.strategy.js';
import { env } from './schemas/env.schema.js';
import attachmentRoutes from './routes/attachment.router.js';
import authRoutes from './routes/auth.router.js';
import chatRoutes from './routes/chat.router.js';
import friendRoutes from './routes/friend.router.js';
import messageRoutes from './routes/message.router.js';
import requestRoutes from './routes/request.router.js';
import userRoutes from './routes/user.router.js';
import { Types } from 'mongoose';
import { Events } from './enums/event/event.enum.js';
import { socketAuthenticatorMiddleware } from './middlewares/socket-auth.middleware.js';
import { Message } from './models/message.model.js';
import { UnreadMessage } from './models/unread-message.model.js';
import { getMemberSockets, getOtherMembers } from './utils/socket.util.js';
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { credentials: true, origin: config.clientUrl } });
// database connection
connectDB();
// global
app.set("io", io);
// userSocketIds
export const userSocketIds = new Map();
// middlewares
app.use(cors({ credentials: true, origin: config.clientUrl }));
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
// route middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/attachment", attachmentRoutes);
io.use(socketAuthenticatorMiddleware);
// socket
io.on("connection", (socket) => {
    var _a, _b;
    userSocketIds.set((_a = socket.user) === null || _a === void 0 ? void 0 : _a._id.toString(), socket.id);
    socket.broadcast.emit(Events.ONLINE, (_b = socket.user) === null || _b === void 0 ? void 0 : _b._id);
    socket.on(Events.MESSAGE, (_c) => __awaiter(void 0, [_c], void 0, function* ({ chat, content, members, url, isPoll, pollQuestion, pollOptions }) {
        var _d, _e, _f;
        // save to db
        const newMessage = yield Message.create({ chat, content, sender: (_d = socket.user) === null || _d === void 0 ? void 0 : _d._id, url, isPoll, pollQuestion, pollOptions });
        const transformedMessage = yield Message.aggregate([
            {
                $match: {
                    chat: new Types.ObjectId(chat),
                    _id: newMessage._id
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
            },
            {
                $addFields: {
                    sender: {
                        $arrayElemAt: ["$sender", 0],
                    },
                },
            },
            {
                $addFields: {
                    "attachments": "$attachments.secureUrl"
                },
            },
            {
                $unwind: {
                    path: "$pollOptions",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "pollOptions.votes",
                    foreignField: "_id",
                    as: "pollOptions.votes",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                avatar: "$avatar.secureUrl"
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id", // Group by the original message _id
                    sender: { $first: "$sender" }, // Keep the first sender object
                    chat: { $first: "$chat" }, // Keep the first chat ID
                    isPoll: { $first: "$isPoll" }, // Keep the first isPoll flag
                    content: { $first: '$content' },
                    url: { $first: '$url' },
                    pollQuestion: { $first: "$pollQuestion" }, // Keep the first pollQuestion
                    pollOptions: {
                        $push: "$pollOptions" // Push each unwound pollOption into the array
                    },
                    attachments: { $first: "$attachments" }, // Keep the first attachments array (optional)
                    createdAt: { $first: "$createdAt" }, // Keep the first createdAt timestamp
                    updatedAt: { $first: "$updatedAt" }, // Keep the first updatedAt timestamp
                }
            },
            {
                $sort: {
                    'createdAt': 1
                }
            }
        ]);
        io.to(getMemberSockets(members)).emit(Events.MESSAGE, transformedMessage[0]);
        // unread message creation for receivers
        const memberIds = getOtherMembers({ members, user: (_e = socket.user) === null || _e === void 0 ? void 0 : _e._id.toString() });
        const updateOrCreateUnreadMessagePromise = memberIds.map((memberId) => __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            const isExistingUnreadMessage = yield UnreadMessage.findOne({ chat, user: memberId });
            if (isExistingUnreadMessage) {
                isExistingUnreadMessage.count ? isExistingUnreadMessage.count++ : null;
                isExistingUnreadMessage.message = newMessage._id;
                isExistingUnreadMessage.save();
                return isExistingUnreadMessage;
            }
            return UnreadMessage.create({ chat, user: memberId, sender: (_g = socket.user) === null || _g === void 0 ? void 0 : _g._id, message: newMessage._id });
        }));
        yield Promise.all(updateOrCreateUnreadMessagePromise);
        const messageData = {};
        if (newMessage.isPoll) {
            messageData.poll = true;
        }
        if (newMessage.url) {
            messageData.url = true;
        }
        if ((_f = newMessage.content) === null || _f === void 0 ? void 0 : _f.length) {
            messageData.content = newMessage.content.substring(0, 25);
        }
        const unreadMessageData = {
            chatId: chat,
            message: messageData,
            sender: transformedMessage[0].sender
        };
        io.to(getMemberSockets(memberIds)).emit(Events.UNREAD_MESSAGE, unreadMessageData);
    }));
    socket.on(Events.MESSAGE_SEEN, (_h) => __awaiter(void 0, [_h], void 0, function* ({ chatId, members }) {
        var _j, _k, _l, _m, _o;
        const areUnreadMessages = yield UnreadMessage.findOne({ chat: chatId, user: (_j = socket.user) === null || _j === void 0 ? void 0 : _j._id });
        if (areUnreadMessages) {
            areUnreadMessages.count = 0;
            areUnreadMessages.readAt = new Date();
            yield areUnreadMessages.save();
        }
        const memberSocketIds = getMemberSockets(members);
        io.to(memberSocketIds).emit(Events.MESSAGE_SEEN, {
            user: {
                _id: (_k = socket.user) === null || _k === void 0 ? void 0 : _k._id,
                username: (_l = socket.user) === null || _l === void 0 ? void 0 : _l.username,
                avatar: (_o = (_m = socket.user) === null || _m === void 0 ? void 0 : _m.avatar) === null || _o === void 0 ? void 0 : _o.secureUrl
            },
            chat: chatId,
            readAt: areUnreadMessages === null || areUnreadMessages === void 0 ? void 0 : areUnreadMessages.readAt,
        });
    }));
    socket.on(Events.MESSAGE_EDIT, (_p) => __awaiter(void 0, [_p], void 0, function* ({ messageId, updatedContent, memberIds }) {
        const updatedMessage = yield Message.findByIdAndUpdate(messageId, { isEdited: true, content: updatedContent }, { new: true, projection: ['chat', 'content', 'isEdited'] });
        io.to(getMemberSockets(memberIds)).emit(Events.MESSAGE_EDIT, updatedMessage);
    }));
    socket.on(Events.USER_TYPING, ({ chatId, members }) => {
        var _a, _b, _c, _d, _e;
        const otherMembers = getOtherMembers({ members, user: (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id.toString() });
        const otherMemberSockets = getMemberSockets(otherMembers);
        io.to(otherMemberSockets).emit(Events.USER_TYPING, {
            user: {
                _id: (_b = socket.user) === null || _b === void 0 ? void 0 : _b._id.toString(),
                username: (_c = socket.user) === null || _c === void 0 ? void 0 : _c.username,
                avatar: (_e = (_d = socket.user) === null || _d === void 0 ? void 0 : _d.avatar) === null || _e === void 0 ? void 0 : _e.secureUrl
            },
            chatId: chatId
        });
    });
    socket.on(Events.VOTE_IN, (_q) => __awaiter(void 0, [_q], void 0, function* ({ chatId, members, messageId, optionIndex }) {
        var _r, _s, _t, _u, _v;
        const message = yield Message.findOneAndUpdate({ chat: chatId, _id: messageId }, { "$addToSet": { [`pollOptions.${optionIndex}.votes`]: (_r = socket.user) === null || _r === void 0 ? void 0 : _r._id } }, { new: true, projection: ["chat", "_id"] });
        const userInfo = {
            _id: (_s = socket.user) === null || _s === void 0 ? void 0 : _s._id,
            avatar: (_u = (_t = socket.user) === null || _t === void 0 ? void 0 : _t.avatar) === null || _u === void 0 ? void 0 : _u.secureUrl,
            username: (_v = socket.user) === null || _v === void 0 ? void 0 : _v.username
        };
        const payload = {
            _id: message === null || message === void 0 ? void 0 : message._id,
            optionIndex,
            user: userInfo
        };
        io.to(getMemberSockets(members)).emit(Events.VOTE_IN, payload);
    }));
    socket.on(Events.VOTE_OUT, (_w) => __awaiter(void 0, [_w], void 0, function* ({ chatId, members, messageId, optionIndex }) {
        var _x, _y;
        const message = yield Message.findOneAndUpdate({ chat: chatId, _id: messageId }, { "$pull": { [`pollOptions.${optionIndex}.votes`]: (_x = socket.user) === null || _x === void 0 ? void 0 : _x._id } }, { new: true, projection: ["chat", "_id"] });
        const userInfo = {
            _id: (_y = socket.user) === null || _y === void 0 ? void 0 : _y._id,
        };
        const payload = {
            _id: message === null || message === void 0 ? void 0 : message._id,
            optionIndex,
            user: userInfo
        };
        io.to(getMemberSockets(members)).emit(Events.VOTE_OUT, payload);
    }));
    socket.on("disconnect", () => {
        var _a;
        socket.broadcast.emit(Events.OFFLINE, (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id);
    });
});
app.get("/", (req, res) => {
    res.status(200).json({ running: true });
});
// error middleware
app.use(errorMiddleware);
if (import.meta.url.endsWith('dist/index.js')) {
    server.listen(env.PORT, () => {
        console.log(`server [STARTED] ~ http://localhost:${env.PORT}`);
    });
}
export default server;
//# sourceMappingURL=index.js.map