import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import { login, logout, signup } from "../controllers/auth.controller.js";

export default Router()

.post("/signup",validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)
.get("/logout",logout)