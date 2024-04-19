import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema } from "../schemas/auth.schema.js";
import { signup } from "../controllers/auth.router.js";

export default Router()

.post("/signup",validate(signupSchema),signup)