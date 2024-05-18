import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadAttachment } from "../controllers/attachment.controller.js";

export default Router()

.post("/",verifyToken,upload.array("attachments[]",5),uploadAttachment)