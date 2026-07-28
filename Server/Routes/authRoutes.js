import express from "express";
import { registerUser } from "../Controllers/authController.js";
import { loginUser } from "../Controllers/authController.js";
import { getCurrentUser } from "../Controllers/authController.js";


const authRouter = express.Router();

authRouter.post("/register",registerUser)
authRouter.post("/login",loginUser)
authRouter.get("/user",getCurrentUser)

export default authRouter;
