import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from "../schemas/auth.schema.js";
import { checkAuth, forgotPassword, login, logout, redirectHandler, resetPassword, sendOtp, signup, verifyOtp } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import passport from 'passport';
export default Router()
    .post("/signup", validate(signupSchema), signup)
    .post("/login", validate(loginSchema), login)
    .post("/forgot-password", validate(forgotPasswordSchema), forgotPassword)
    .post("/reset-password", validate(resetPasswordSchema), resetPassword)
    .get("/send-otp", verifyToken, sendOtp)
    .post("/verify-otp", verifyToken, validate(verifyOtpSchema), verifyOtp)
    .get("/check-auth", verifyToken, checkAuth)
    .get("/logout", logout)
    .get("/google", passport.authenticate("google", { session: false, scope: ["email", "profile"] }))
    .get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/" }), redirectHandler)
    .get("/github", passport.authenticate("github", { session: false, scope: ["user"] }))
    .get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/" }), redirectHandler);
//# sourceMappingURL=auth.router.js.map