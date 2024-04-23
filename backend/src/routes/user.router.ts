import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getUserDetails } from "../controllers/user.controller.js";

export default Router()

.get("/",verifyToken,getUserDetails)