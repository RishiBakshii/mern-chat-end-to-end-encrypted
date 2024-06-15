import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fetchAttachments, uploadAttachment } from "../controllers/attachment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadAttachmentSchema } from "../schemas/message.schema.js";

export default Router()

.post("/",verifyToken,validate(uploadAttachmentSchema),upload.array("attachments[]",5),uploadAttachment)
.get("/:id",verifyToken,fetchAttachments)