import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createChatSchema } from "../schemas/chat.schema.js";
import { createChat, getUserChats } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";

export default Router()

.post("/",verifyToken,validate(createChatSchema),createChat)
.get("/",verifyToken,getUserChats)