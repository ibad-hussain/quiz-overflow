import express from "express";
import { getUserData, shareProfile, updateUserProfile, deleteUserProfile, getBadgesCountAndList } from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";


const userRouter = express.Router();

// Route to get user data
userRouter.get("/data", userAuth, getUserData);

// Route to update user profile
userRouter.put("/update-profile", userAuth, updateUserProfile);

// Route to get delete account
userRouter.delete("/delete-profile", userAuth, deleteUserProfile);

// Route to get number and list of badges
userRouter.get("/badges", userAuth, getBadgesCountAndList);

// Route to get share user profile
userRouter.get("/share-profile/:developerId", shareProfile);


export default userRouter;
