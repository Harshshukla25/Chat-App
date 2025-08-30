import express from "express";
import { forgotPassword, login, logout, resetPassword, signup } from "../controllers/auth.controllers.js";


const authRouter=express.Router();

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/logout",logout)
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);


export default authRouter;
