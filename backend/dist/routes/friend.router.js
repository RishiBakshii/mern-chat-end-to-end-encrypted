import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { getFriends } from "../controllers/friend.controller.js";
export default Router()
    .get("/", verifyToken, getFriends);
//# sourceMappingURL=friend.router.js.map