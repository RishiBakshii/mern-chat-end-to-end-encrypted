import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getUserByUsername, getUserDetails, testEmailHandler, udpateUser, updateNotifications } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fileValidation } from "../middlewares/file-validation.middleware.js";
import { notificationsSchema } from "../schemas/user.schema.js";
import { validate } from "../middlewares/validate.middleware.js";

export default Router()

.get("/",verifyToken,getUserDetails)
.get("/search",verifyToken,getUserByUsername)
.patch("/",verifyToken,upload.single("avatar"),fileValidation,udpateUser)
.patch("/notifications",verifyToken,validate(notificationsSchema),updateNotifications)
.get("/test-email",verifyToken,testEmailHandler)