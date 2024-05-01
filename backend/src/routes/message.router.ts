import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getMessages } from "../controllers/message.controller.js";

export default Router()

.get("/:id",verifyToken,getMessages)