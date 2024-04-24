import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "../schemas/auth.schema.js";
import { forgotPassword, login, logout, resetPassword, signup } from "../controllers/auth.controller.js";

export default Router()

.post("/signup",validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)
.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword)
.post("/reset-password",validate(resetPasswordSchema),resetPassword)
.get("/logout",logout)