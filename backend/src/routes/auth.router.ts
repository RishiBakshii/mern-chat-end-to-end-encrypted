import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, signupSchema } from "../schemas/auth.schema.js";
import { forgotPassword, login, logout, signup } from "../controllers/auth.controller.js";

export default Router()

.post("/signup",validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)
.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword)
.get("/logout",logout)