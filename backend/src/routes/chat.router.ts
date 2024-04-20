import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createChatSchema, addMemberToChatSchema } from "../schemas/chat.schema.js";
import { addMemberToChat, createChat, getUserChats } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";


export default Router()

.post("/",verifyToken,validate(createChatSchema),createChat)
.get("/",verifyToken,getUserChats)
.patch("/:id/members",verifyToken,validate(addMemberToChatSchema),addMemberToChat)