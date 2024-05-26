import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createChatSchema, addMemberToChatSchema, removeMemberfromChat } from "../schemas/chat.schema.js";
import { addMemberToChat, createChat, getUserChats, removeMemberFromChat } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fileValidation } from "../middlewares/file-validation.middleware.js";
export default Router()
    .post("/", verifyToken, upload.single("avatar"), fileValidation, validate(createChatSchema), createChat)
    .get("/", verifyToken, getUserChats)
    .patch("/:id/members", verifyToken, validate(addMemberToChatSchema), addMemberToChat)
    .delete("/:id/members", verifyToken, validate(removeMemberfromChat), removeMemberFromChat);
//# sourceMappingURL=chat.router.js.map