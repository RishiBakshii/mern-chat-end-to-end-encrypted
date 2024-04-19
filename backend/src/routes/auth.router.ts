import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import { login, signup } from "../controllers/auth.router.js";

export default Router()

.post("/signup",validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)