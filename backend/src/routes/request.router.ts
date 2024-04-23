import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { createRequest, getUserRequests } from "../controllers/request.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRequestSchema } from "../schemas/request.schema.js";

export default Router()

.get("/",verifyToken,getUserRequests)
.post("/",verifyToken,validate(createRequestSchema),createRequest)