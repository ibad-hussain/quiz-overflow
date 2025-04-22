import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";


const authRouter = express.Router();

// Route to register user
authRouter.post("/register", register);

// Route to login user
authRouter.post("/login", login);

// Route to logout user
authRouter.post("/logout", userAuth, logout);


export default authRouter;
