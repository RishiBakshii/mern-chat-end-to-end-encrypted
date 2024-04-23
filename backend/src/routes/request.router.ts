import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getUserRequests } from "../controllers/request.controller.js";

export default Router()

.get("/",verifyToken,getUserRequests)