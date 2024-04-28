import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from "../schemas/auth.schema.js";
import { checkAuth, forgotPassword, login, logout, resetPassword, sendOtp, signup, verifyOtp } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

export default Router()

.post("/signup",upload.single("avatar"),validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)
.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword)
.post("/reset-password",validate(resetPasswordSchema),resetPassword)
.get("/send-otp",verifyToken,sendOtp)
.post("/verify-otp",verifyToken,validate(verifyOtpSchema),verifyOtp)
.get("/check-auth",verifyToken,checkAuth)
.get("/logout",logout)