import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fetchAttachments, uploadAttachment } from "../controllers/attachment.controller.js";

export default Router()

.post("/",verifyToken,upload.array("attachments[]",5),uploadAttachment)
.get("/:id",verifyToken,fetchAttachments)