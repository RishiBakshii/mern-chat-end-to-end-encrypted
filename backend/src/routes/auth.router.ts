import { Router } from "express";
import passport from 'passport';
import { config } from "../config/env.config.js";
import { checkAuth, forgotPassword, login, logout, redirectHandler, resetPassword, sendOtp, signup, updateUserKeys, verifyOtp, verifyPassword, verifyPrivateKeyToken } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { forgotPasswordSchema, keySchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema, verifyPasswordSchema, verifyPrivateKeyTokenSchema } from "../schemas/auth.schema.js";

export default Router()

.post("/signup",validate(signupSchema),signup)
.post("/login",validate(loginSchema),login)
.post("/forgot-password",validate(forgotPasswordSchema),forgotPassword)
.post("/reset-password",validate(resetPasswordSchema),resetPassword)
.get("/send-otp",verifyToken,sendOtp)
.post("/verify-otp",verifyToken,validate(verifyOtpSchema),verifyOtp)
.post("/verify-password", verifyToken, validate(verifyPasswordSchema), verifyPassword)
.post('/verify-privatekey-token',verifyToken,validate(verifyPrivateKeyTokenSchema),verifyPrivateKeyToken)
.get("/check-auth",verifyToken,checkAuth)
.patch("/user/keys",verifyToken,validate(keySchema),updateUserKeys)
.get("/logout",logout)
.get("/google",passport.authenticate("google",{session:false,scope:["email","profile"]}))
.get("/google/callback",passport.authenticate("google",{session:false,failureRedirect:`${config.clientUrl}/auth/login`}),redirectHandler)
.get("/github",passport.authenticate("github",{session:false,scope:["user"]}))
.get("/github/callback",passport.authenticate("github",{session:false,failureRedirect:"/"}),redirectHandler)