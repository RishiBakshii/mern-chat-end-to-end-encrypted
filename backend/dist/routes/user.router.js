import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getUserByUsername, getUserDetails, udpateUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { fileValidation } from "../middlewares/file-validation.middleware.js";
export default Router()
    .get("/", verifyToken, getUserDetails)
    .get("/search", verifyToken, getUserByUsername)
    .patch("/", verifyToken, upload.single("avatar"), fileValidation, udpateUser);
//# sourceMappingURL=user.router.js.map